package ru.nsu.ctf.paketnikback.domain.service

import org.springframework.web.bind.annotation.RequestParam
import ru.nsu.ctf.paketnikback.domain.dto.PacketStreamResponse
import ru.nsu.ctf.paketnikback.domain.dto.UnallocatedPacketDto
import ru.nsu.ctf.paketnikback.domain.entity.packet.PacketData
import ru.nsu.ctf.paketnikback.domain.entity.packet.layer.HttpInfo

interface PacketStreamService {
    fun getAllStreams(): List<PacketStreamResponse>

    fun getStreamPackets(id: String): List<PacketData>

    fun getUnallocated(): List<UnallocatedPacketDto>

    fun exportHttpRequest(
        @RequestParam streamId: String,
        @RequestParam packetIndex: Int,
        @RequestParam format: String,
    ): String

    fun getStreamHttpInfo(id: String): List<HttpInfo>

    /**
     * Reads all packets from pcap objectName in bucket bucketName,
     * splits them all to streams and unallocated packets and saves that all to the database.
     */
    fun createStreamsFromPcap(bucketName: String, objectName: String)
}
