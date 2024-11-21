package ru.nsu.ctf.paketnikback.utils

import io.pkts.PacketHandler
import io.pkts.buffer.Buffer
import io.pkts.packet.Packet
import io.pkts.packet.PCapPacket

class RegexSearchPcapHandler : PacketHandler {
    private var matches : List<Triple<Int, String, Int>>
    private var regex : Regex
    
    constructor(_regex : Regex) {
        matches = listOf<Triple<Int, String, Int>>()
        regex = _regex
    }
    
    fun getMatches() : List<Triple<Int, String, Int>> {
        return matches
    }

    override fun nextPacket(packet : Packet) : Boolean {

        val pcapPacket = (PCapPacket) packet.getPacket(Protocol.PCAP)
        val buffer = pcapPacket.getPayload()
        
        // TODO: Implement finding matches

        // Return true if you want to keep receiving next packet
        // Return false if you want to stop traversal
        return true
    }
}
