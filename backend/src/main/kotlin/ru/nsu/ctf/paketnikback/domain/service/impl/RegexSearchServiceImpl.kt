package ru.nsu.ctf.paketnikback.domain.service.impl

import org.springframework.stereotype.Service

import ru.nsu.ctf.paketnikback.domain.dto.RegexSearchRequest
import ru.nsu.ctf.paketnikback.domain.dto.RegexSearchResponse
import ru.nsu.ctf.paketnikback.domain.dto.RegexSearchMatch
import ru.nsu.ctf.paketnikback.domain.service.RegexSearchService

import ru.nsu.ctf.paketnikback.domain.entity.packet.UnallocatedPacketDocument
import ru.nsu.ctf.paketnikback.domain.entity.packet.PacketData
import ru.nsu.ctf.paketnikback.domain.entity.stream.PacketStreamDocument

import ru.nsu.ctf.paketnikback.domain.repository.PacketStreamRepository
import ru.nsu.ctf.paketnikback.domain.repository.UnallocatedPacketRepository

import ru.nsu.ctf.paketnikback.utils.logger
import ru.nsu.ctf.paketnikback.utils.RegexSearchPcapHandler
import kotlin.io.encoding.Base64

@Service
class RegexSearchServiceImpl(
    private val packetStreamRepository: PacketStreamRepository,
    private val unallocatedPacketRepository: UnallocatedPacketRepository,
) : RegexSearchService {
    private val log = logger()

    override fun search(request: RegexSearchRequest): RegexSearchResponse {
        val filename = request.filename
        
        val regex = try {
            Regex(request.regex)
        } catch (e: Exception) {
            throw IllegalArgumentException("ERR: Invalid regex '${request.regex}': ${e.message}")
        }

        val packetsData = findPacketsDataByPcapId(filename)
        val matches = findMatches(packetsData, regex)

        return RegexSearchResponse(matches)
    }

    private fun findPacketsDataByPcapId(pcapId: String): List<PacketData> {
        val items = mutableListOf<PacketData>()

        val streams = packetStreamRepository.findAllByPcapId(pcapId)
        val unallocated = unallocatedPacketRepository.findAllByPcapId(pcapId)

        streams.forEach { stream -> 
            items.addAll(stream.packets)
        }

        unallocatedPackets.forEach { packet ->
            items.add(packet.packet)
        }

        return items.toList()
    }

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
