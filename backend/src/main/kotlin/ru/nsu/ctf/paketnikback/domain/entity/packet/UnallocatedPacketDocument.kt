package ru.nsu.ctf.paketnikback.domain.entity.packet

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.util.UUID

@Document(collection = "unallocated")
data class UnallocatedPacketDocument(
    @Id
    val id: String = UUID.randomUUID().toString(),
    val pcapId: String,
    val packet: PacketData,
)
