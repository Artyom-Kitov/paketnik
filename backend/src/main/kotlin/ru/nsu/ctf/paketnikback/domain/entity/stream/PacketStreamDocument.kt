package ru.nsu.ctf.paketnikback.domain.entity.stream

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import ru.nsu.ctf.paketnikback.domain.entity.packet.PacketData
import ru.nsu.ctf.paketnikback.domain.entity.packet.layer.HttpInfo
import java.util.UUID

@Document(collection = "streams")
data class PacketStreamDocument(
    @Id
    val id: String = UUID.randomUUID().toString(),
    val srcIp: String,
    val dstIp: String,
    val srcPort: Int,
    val dstPort: Int,
    val pcapId: String,
    val packets: List<PacketData> = emptyList(),
)
