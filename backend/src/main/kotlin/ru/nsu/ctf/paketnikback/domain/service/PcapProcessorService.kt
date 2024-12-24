package ru.nsu.ctf.paketnikback.domain.service

import ru.nsu.ctf.paketnikback.domain.dto.RegexSearchMatch
import ru.nsu.ctf.paketnikback.domain.entity.packet.PacketData

interface PcapProcessorService {
    fun searchByRegex(pcapId: String, regex: Regex): List<RegexSearchMatch>
    fun applyAllRulesToPcap(pcapId: String)
    fun applyAllRules()
}
