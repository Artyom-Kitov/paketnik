package ru.nsu.ctf.paketnikback.domain.util

import ru.nsu.ctf.paketnikback.domain.entity.packet.PacketData
import ru.nsu.ctf.paketnikback.domain.entity.rule.Rule
import kotlin.io.encoding.Base64
import kotlin.io.encoding.ExperimentalEncodingApi

object RuleMatcher {
    @OptIn(ExperimentalEncodingApi::class)
    fun checkPacketMatch(rule: Rule, packet: PacketData): Boolean {
        val decodedData = Base64.decode(packet.encodedData)
        val text = decodedData.toString(Charsets.US_ASCII)
        return rule.regex.matcher(text).matches()
    }
} 
