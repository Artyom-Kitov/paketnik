package ru.nsu.ctf.paketnikback.domain.dto

data class PacketStreamResponse(
    val id: String,
    val srcIp: String,
    val dstIp: String,
    val srcPort: Int,
    val dstPort: Int,
    val service: ContestServiceResponse?,
    val pcapId: String,
)
