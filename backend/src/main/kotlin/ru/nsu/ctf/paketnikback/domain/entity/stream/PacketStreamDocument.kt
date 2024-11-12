package ru.nsu.ctf.paketnikback.domain.entity.stream

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import ru.nsu.ctf.paketnikback.domain.entity.packet.Packet

@Document(collection = "streams")
data class PacketStreamDocument(
    @Id
    val stream: PacketStream,
    val packets: List<Packet>,
)
