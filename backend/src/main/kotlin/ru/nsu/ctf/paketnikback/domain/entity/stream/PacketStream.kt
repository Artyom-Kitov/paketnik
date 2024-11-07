package ru.nsu.ctf.paketnikback.domain.entity.stream

data class PacketStream(
    val sourceIp: String,
    val destinationIp: String,
    val sourcePort: Int,
    val destinationPort: Int,
)
