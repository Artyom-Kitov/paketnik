package ru.nsu.ctf.paketnikback.domain.service.impl

import io.minio.GetObjectArgs
import io.minio.MinioClient
import io.pkts.Pcap
import io.pkts.packet.IPv4Packet
import io.pkts.packet.MACPacket
import io.pkts.packet.Packet
import io.pkts.packet.TCPPacket
import io.pkts.packet.UDPPacket
import io.pkts.protocol.Protocol
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.data.mongodb.core.query.Query
import org.springframework.stereotype.Service
import ru.nsu.ctf.paketnikback.domain.dto.PacketStreamResponse
import ru.nsu.ctf.paketnikback.domain.dto.UnallocatedPacketDto
import ru.nsu.ctf.paketnikback.domain.entity.packet.PacketData
import ru.nsu.ctf.paketnikback.domain.entity.packet.UnallocatedPacketDocument
import ru.nsu.ctf.paketnikback.domain.entity.packet.layer.EthernetInfo
import ru.nsu.ctf.paketnikback.domain.entity.packet.layer.IPv4Info
import ru.nsu.ctf.paketnikback.domain.entity.packet.layer.LayersInfo
import ru.nsu.ctf.paketnikback.domain.entity.packet.layer.TcpInfo
import ru.nsu.ctf.paketnikback.domain.entity.packet.layer.UdpInfo
import ru.nsu.ctf.paketnikback.domain.entity.stream.PacketStreamDocument
import ru.nsu.ctf.paketnikback.domain.mapper.PacketMapper
import ru.nsu.ctf.paketnikback.domain.repository.PacketStreamRepository
import ru.nsu.ctf.paketnikback.domain.repository.UnallocatedPacketRepository
import ru.nsu.ctf.paketnikback.domain.service.PacketStreamService
import ru.nsu.ctf.paketnikback.exception.EntityNotFoundException
import ru.nsu.ctf.paketnikback.utils.logger
import java.time.Instant
import kotlin.io.encoding.Base64
import kotlin.io.encoding.ExperimentalEncodingApi

@Service
final class PacketStreamServiceImpl(
    private val packetStreamRepository: PacketStreamRepository,
    private val unallocatedPacketRepository: UnallocatedPacketRepository,
    private val packetMapper: PacketMapper,
    private val mongoTemplate: MongoTemplate,
    private val minioClient: MinioClient,
) : PacketStreamService {
    private val log = logger()

    override fun getAllStreams(): List<PacketStreamResponse> {
        val query = Query()
        query
            .fields()
            .include("id", "srcIp", "dstIp", "srcPort", "dstPort", "pcapId")
        return mongoTemplate
            .find(query, PacketStreamDocument::class.java)
            .map(packetMapper::streamToResponse)
    }

    override fun getStreamPackets(id: String): List<PacketData> = packetStreamRepository
        .findById(id)
        .orElseThrow { EntityNotFoundException("no such stream with id $id") }
        .packets

    override fun getUnallocated(): List<UnallocatedPacketDto> = unallocatedPacketRepository
        .findAll()
        .map(packetMapper::unallocatedToDto)

    override fun generatePcapForStream(streamId: String): ByteArray {
        val packets = getStreamPackets(streamId)

        if (packets.isEmpty()) {
            throw EntityNotFoundException("Stream not found")
        }

        val outputStream = ByteArrayOutputStream()
        Pcap.openDead().use { pcapHandle ->
            packets.forEach { packetData ->
                val rawPacket = convertToRawPacket(packetData)
                pcapHandle.dump(rawPacket)
            }
        }

        return outputStream.toByteArray()
    }

    private fun convertToRawPacket(packetData: PacketData): DefaultEthernetPacket {
        val payloadData = Base64.decode(packetData.encodedData)

        val tcpPacket = packetData.layers.tcp?.let { tcpInfo ->
            DefaultTCPPacket.create(
                payloadData,
                tcpInfo.srcPort,
                tcpInfo.dstPort,
                tcpInfo.sequenceNumber,
                tcpInfo.ackNumber,
                tcpInfo.dataOffset.toByte(),
                tcpInfo.urg,
                tcpInfo.ack,
                tcpInfo.psh,
                tcpInfo.rst,
                tcpInfo.syn,
                tcpInfo.fin,
                tcpInfo.windowSize,
                tcpInfo.checksum
            )
        }

        val ipv4Packet = packetData.layers.ipv4?.let { ipv4Info ->
            DefaultIPv4Packet.create(
                tcpPacket ?: ApplicationPacket(payloadData),
                ipv4Info.srcIp,
                ipv4Info.dstIp,
                ipv4Info.ttl.toByte(),
                Protocol.TCP.number.toByte(),
                ipv4Info.headerChecksum
            )
        }

        val ethernetPacket = packetData.layers.ethernet?.let { ethernetInfo ->
            DefaultEthernetPacket.create(
                ipv4Packet ?: ApplicationPacket(payloadData),
                ethernetInfo.srcMac,
                ethernetInfo.dstMac,
                0x0800 // Тип для IPv4
            )
        }

        // Если отсутствует Ethernet-слой, возвращаем IPv4 или TCP как базовый пакет
        return ethernetPacket ?: ipv4Packet ?: tcpPacket ?: DefaultEthernetPacket.create(
            ApplicationPacket(payloadData),
            "00:00:00:00:00:00", // Default source MAC
            "00:00:00:00:00:00", // Default destination MAC
            0x0800
        )
    }

    override fun createStreamsFromPcap(bucketName: String, objectName: String) {
        log.info("creating streams with objectId = '$objectName'")
        minioClient
            .getObject(
                GetObjectArgs
                    .builder()
                    .bucket(bucketName)
                    .`object`(objectName)
                    .build(),
            ).use { stream ->
                val packets = mutableListOf<Packet>()
                Pcap.openStream(stream).loop { packet ->
                    packets.add(packet)
                    true
                }

                val packetsData = packets.withIndex().map({ x -> convertToPacketData(x.value, x.index) })

                val (tcpPackets, otherPackets) = packetsData.partition { it.layers.tcp != null }
                saveAsStreams(tcpPackets, objectName)
                saveUnallocated(otherPackets, objectName)
            }
    }

    private fun saveAsStreams(packets: List<PacketData>, objectId: String) {
        data class StreamKey(
            val srcIp: String,
            val dstIp: String,
            val srcPort: Int,
            val dstPort: Int,
        )
        packets
            .groupBy { packet ->
                val ipv4Info = packet.layers.ipv4 ?: throw IllegalStateException("given packet is not an ip packet")
                val tcpInfo = packet.layers.tcp ?: throw IllegalStateException("given packet is not a tcp packet")
                StreamKey(
                    srcIp = ipv4Info.srcIp,
                    dstIp = ipv4Info.dstIp,
                    srcPort = tcpInfo.srcPort,
                    dstPort = tcpInfo.dstPort,
                )
            }.forEach { (stream, packets) ->
                val streamDocument = PacketStreamDocument(
                    srcIp = stream.srcIp,
                    dstIp = stream.dstIp,
                    srcPort = stream.srcPort,
                    dstPort = stream.dstPort,
                    pcapId = objectId,
                    packets = packets,
                )
                packetStreamRepository.save(streamDocument)
            }
    }

    private fun saveUnallocated(packets: List<PacketData>, objectId: String) {
        packets.forEach {
            unallocatedPacketRepository.save(UnallocatedPacketDocument(pcapId = objectId, packet = it))
        }
    }

    @OptIn(ExperimentalEncodingApi::class)
    private fun convertToPacketData(packet: Packet, index: Int): PacketData {
        val receivedAt = Instant.ofEpochMilli(packet.arrivalTime / 1000)
        val encodedData = Base64.encode(packet.payload.array)
        val info = readPacketInfo(packet)
        val tags = listOf<String>()
        return PacketData(
            receivedAt = receivedAt,
            encodedData = encodedData,
            layers = info,
            tags = tags,
            index = index,
        )
    }

    private fun readPacketInfo(packet: Packet): LayersInfo {
        val layers = LayersInfo(
            ethernet = readEthernet(packet),
            ipv4 = readIPv4(packet),
            tcp = readTcp(packet),
            udp = readUdp(packet),
        )
        return layers
    }

    private companion object {
        private fun readEthernet(packet: Packet): EthernetInfo? {
            val ethernet = packet.getPacket(Protocol.ETHERNET_II) as? MACPacket ?: return null
            return EthernetInfo(
                srcMac = ethernet.sourceMacAddress,
                dstMac = ethernet.destinationMacAddress,
            )
        }

        private fun readIPv4(packet: Packet): IPv4Info? {
            val ipv4 = packet.getPacket(Protocol.IPv4) as? IPv4Packet ?: return null
            return IPv4Info(
                version = ipv4.version.toByte(),
                length = ipv4.totalIPLength,
                ttl = ipv4.timeToLive,
                doNotFragment = ipv4.isDontFragmentSet,
                moreFragments = ipv4.isMoreFragmentsSet,
                fragmentOffset = ipv4.fragmentOffset.toInt(),
                headerChecksum = ipv4.ipChecksum,
                srcIp = ipv4.sourceIP,
                dstIp = ipv4.destinationIP,
            )
        }

        @OptIn(ExperimentalEncodingApi::class)
        private fun readTcp(packet: Packet): TcpInfo? {
            val tcp = packet.getPacket(Protocol.TCP) as? TCPPacket ?: return null
            return TcpInfo(
                srcPort = tcp.sourcePort,
                dstPort = tcp.destinationPort,
                sequenceNumber = tcp.sequenceNumber,
                ackNumber = tcp.acknowledgementNumber,
                dataOffset = tcp.headerLength,
                cwr = tcp.isCWR,
                ece = tcp.isECE,
                urg = tcp.isURG,
                ack = tcp.isACK,
                psh = tcp.isPSH,
                rst = tcp.isRST,
                syn = tcp.isSYN,
                fin = tcp.isFIN,
                windowSize = tcp.windowSize,
                checksum = tcp.checksum,
                urgentPointer = tcp.urgentPointer,
                data = Base64.encode(tcp.payload?.array ?: byteArrayOf()),
            )
        }

        @OptIn(ExperimentalEncodingApi::class)
        private fun readUdp(packet: Packet): UdpInfo? {
            val udp = packet.getPacket(Protocol.UDP) as? UDPPacket ?: return null
            return UdpInfo(
                srcPort = udp.sourcePort,
                dstPort = udp.destinationPort,
                length = udp.length,
                checksum = udp.checksum,
                data = Base64.encode(udp.payload?.array ?: byteArrayOf()),
            )
        }
    }
}
