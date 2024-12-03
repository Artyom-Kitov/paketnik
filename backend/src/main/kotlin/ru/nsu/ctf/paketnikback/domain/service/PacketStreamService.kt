package ru.nsu.ctf.paketnikback.domain.service

import ru.nsu.ctf.paketnikback.domain.dto.PacketStreamResponse
import ru.nsu.ctf.paketnikback.domain.dto.UnallocatedPacketDto
import ru.nsu.ctf.paketnikback.domain.entity.packet.PacketData

interface PacketStreamService {
    fun getAllStreams(): List<PacketStreamResponse>
    
    fun getStreamPackets(id: String): List<PacketData>
    
    fun getUnallocated(): List<UnallocatedPacketDto>

    /**
     * Reads all packets from pcap objectName in bucket bucketName,
     * splits them all to streams and unallocated packets and saves that all to the database.
     */
    fun createStreamsFromPcap(bucketName: String, objectName: String)
}
