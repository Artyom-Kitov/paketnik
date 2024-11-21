package ru.nsu.ctf.paketnikback.utils

import io.pkts.PacketHandler
import io.pkts.buffer.Buffer
import io.pkts.packet.Packet
import io.pkts.packet.PCapPacket

class RegexSearchPcapHandler : PacketHandler {
    private var matches : mutableListOf<Triple<Int, String, Int>>()
    private var regex : Regex
    private var packetsCounter : Int = 0
    
    constructor(_regex : Regex) {
        regex = _regex
    }
    
    fun getMatches() : List<Triple<Int, String, Int>> {
        return matches.toList()
    }

    override fun nextPacket(packet : Packet) : Boolean {

        val pcapPacket : PCapPacket = packet.getPacket(Protocol.PCAP)
        val buffer : ByteArray = pcapPacket.getPayload()
        val text = buffer.toString(Charsets.UTF_8)
        
        val items = regex.findAll(text)
        for (item in items) {
            matches.add(Triple(packetsCounter, item.value, item.range.first))
        }
        
        packetsCounter = packetsCounter + 1

        // Return true if you want to keep receiving next packet
        // Return false if you want to stop traversal
        return true
    }
}
