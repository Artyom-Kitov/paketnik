package ru.nsu.ctf.paketnikback.domain.service.impl

import org.springframework.stereotype.Service

import ru.nsu.ctf.paketnikback.domain.dto.RegexSearchMatch
import ru.nsu.ctf.paketnikback.domain.entity.packet.PacketData
import ru.nsu.ctf.paketnikback.domain.repository.PacketStreamRepository
import ru.nsu.ctf.paketnikback.domain.repository.UnallocatedPacketRepository
import ru.nsu.ctf.paketnikback.domain.service.PcapProcessorService
import ru.nsu.ctf.paketnikback.exception.EntityNotFoundException
import kotlin.io.encoding.Base64
import kotlin.io.encoding.ExperimentalEncodingApi

@Service
class PcapProcessorServiceImpl(
    private val packetStreamRepository: PacketStreamRepository,
    private val unallocatedPacketRepository: UnallocatedPacketRepository,
) : PcapProcessorService {
    override fun searchByRegex(pcapId: String, regex: Regex): List<RegexSearchMatch> {
        val packets = findPacketsByPcapId(pcapId)
        val matches = findMatches(packets, regex)
        return matches
    }

    private fun findPacketsByPcapId(pcapId: String): List<PacketData> {
        val packets = mutableListOf<PacketData>()

        val streams = packetStreamRepository.findAllByPcapId(pcapId)
        val unallocated = unallocatedPacketRepository.findAllByPcapId(pcapId)

        if (streams.isEmpty() && unallocated.isEmpty()) {
            throw EntityNotFoundException("ERR: File '$pcapId' not found")
        }

        streams.forEach { stream -> 
            packets.addAll(stream.packets)
        }

        unallocated.forEach { packet ->
            packets.add(packet.packet)
        }

        return packets.toList()
    }

    @OptIn(ExperimentalEncodingApi::class)
    private fun findMatches(packets: List<PacketData>, regex: Regex): List<RegexSearchMatch> {
        val matches = mutableListOf<RegexSearchMatch>()

        packets.forEach { packet -> 
            val decodedData = Base64.decode(packet.encodedData)
            val text = decodedData.toString(Charsets.UTF_8)

            val items = regex.findAll(text)
            items.forEach { item -> 
                matches.add(RegexSearchMatch(packet.index, item.value, item.range.first)) 
            }
        }

        return matches.toList()
    }
}
