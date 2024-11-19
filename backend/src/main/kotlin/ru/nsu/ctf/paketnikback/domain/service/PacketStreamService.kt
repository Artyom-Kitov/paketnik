package ru.nsu.ctf.paketnikback.domain.service

import ru.nsu.ctf.paketnikback.domain.entity.packet.Packet
import ru.nsu.ctf.paketnikback.domain.entity.stream.PacketStream
import ru.nsu.ctf.paketnikback.domain.entity.stream.PacketStreamDocument

interface PacketStreamService {
    fun addPackets(stream: PacketStream, packets: List<Packet>)

    fun getAllStreams(): List<PacketStreamDocument>
}
