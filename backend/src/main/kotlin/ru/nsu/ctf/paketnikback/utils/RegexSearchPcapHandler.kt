package ru.nsu.ctf.paketnikback.utils

import io.pkts.PacketHandler
import io.pkts.buffer.Buffer
import io.pkts.packet.Packet
import io.pkts.packet.PCapPacket

import ru.nsu.ctf.paketnikback.domain.dto.RegexSearchMatch

class RegexSearchPcapHandler(regex : Regex) : PacketHandler {
    private var matches = mutableListOf<RegexSearchMatch>()
    private var packetsCounter : Int = 0
    
    fun getMatches() : List<RegexSearchMatch> {
        return matches.toList()
    }

    override fun nextPacket(packet : Packet) : Boolean {

        val pcapPacket : PCapPacket = packet.getPacket(Protocol.PCAP)
        val buffer : ByteArray = pcapPacket.getPayload()
        val text = buffer.toString(Charsets.UTF_8)
        
        val items = regex.findAll(text)
        for (item in items) {
            matches.add(RegexSearchMatch(packetsCounter, item.value, item.range.first))
        }
        
        packetsCounter = packetsCounter + 1

        // Return true if you want to keep receiving next packet
        // Return false if you want to stop traversal
        return true
    }
}
