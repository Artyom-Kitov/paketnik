package ru.nsu.ctf.paketnikback.domain.dto

import ru.nsu.ctf.paketnikback.domain.entity.packet.PacketData

data class UnallocatedPacketDto(
    val id: String,
    val packet: PacketData,
)
