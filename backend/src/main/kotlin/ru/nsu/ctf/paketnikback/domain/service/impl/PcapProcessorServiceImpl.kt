package ru.nsu.ctf.paketnikback.domain.service.impl

import org.springframework.stereotype.Service

import ru.nsu.ctf.paketnikback.domain.dto.RegexSearchMatch
import ru.nsu.ctf.paketnikback.domain.entity.packet.PacketData
import ru.nsu.ctf.paketnikback.domain.entity.packet.UnallocatedPacketDocument
import ru.nsu.ctf.paketnikback.domain.entity.stream.PacketStreamDocument
import ru.nsu.ctf.paketnikback.domain.entity.rule.Rule
import ru.nsu.ctf.paketnikback.domain.mapper.RuleMapper
import ru.nsu.ctf.paketnikback.domain.repository.RuleRepository
import ru.nsu.ctf.paketnikback.domain.repository.PacketStreamRepository
import ru.nsu.ctf.paketnikback.domain.repository.UnallocatedPacketRepository

import ru.nsu.ctf.paketnikback.domain.service.PcapProcessorService
import ru.nsu.ctf.paketnikback.domain.service.RuleService

import ru.nsu.ctf.paketnikback.exception.EntityNotFoundException

import kotlin.io.encoding.Base64
import kotlin.io.encoding.ExperimentalEncodingApi

@Service
class PcapProcessorServiceImpl(
    private val packetStreamRepository: PacketStreamRepository,
    private val unallocatedPacketRepository: UnallocatedPacketRepository,
    private val ruleRepository: RuleRepository,
    private val ruleMapper: RuleMapper,
    private val ruleService: RuleService,
) : PcapProcessorService {

    override fun searchByRegex(pcapId: String, regex: Regex): List<RegexSearchMatch> {
        val packets = findPacketsByPcapId(pcapId)
        val matches = findMatches(packets, regex)
        return matches
    }

    override fun applyAllRules() {
        val rules = ruleService.getAllRulesAsEntity()
        val streams = packetStreamRepository.findAll()
        val unallocated = unallocatedPacketRepository.findAll()

        streams.forEach { stream -> 
            applyRulesToStream(rules, stream)
        }

        unallocated.forEach { packet ->
            applyRulesToUnallocated(rules, packet)
        }
    }

    override fun applyAllRulesToPcap(pcapId: String) {
        val rules = ruleService.getAllRulesAsEntity()
        val streams = packetStreamRepository.findAllByPcapId(pcapId)
        val unallocated = unallocatedPacketRepository.findAllByPcapId(pcapId)

        streams.forEach { stream -> 
            applyRulesToStream(rules, stream)
        }

        unallocated.forEach { packet ->
            applyRulesToUnallocated(rules, packet)
        }
    }
    private fun applyRulesToStream(rules: List<Rule>, stream: PacketStreamDocument) {
        val updatedPackets = applyRulesToPackets(rules, stream.packets)
        val updatedStream = stream.copy(packets = updatedPackets)
        packetStreamRepository.save(updatedStream)
    }

    private fun applyRulesToUnallocated(rules: List<Rule>, unallocated: UnallocatedPacketDocument) {
        val updatedUnallocated = unallocated.copy(packet = applyRulesToPacket(rules, unallocated.packet))
        unallocatedPacketRepository.save(updatedUnallocated)
    }

    private fun applyRulesToPackets(rules: List<Rule>, packets: List<PacketData>): List<PacketData> {
        return packets.map { packet -> applyRulesToPacket(rules, packet) }
    }

    private fun applyRulesToPacket(rules: List<Rule>, packet: PacketData): PacketData {
        val newTags = mutableListOf<String>()
        rules.forEach { rule ->
            if (ruleService.checkPacketMatch(rule, packet)) {
                newTags.add(rule.name)
            }
        }
        return packet.copy(tags = newTags.toList())
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
