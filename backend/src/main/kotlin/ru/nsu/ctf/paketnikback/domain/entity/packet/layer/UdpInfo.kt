package ru.nsu.ctf.paketnikback.domain.entity.packet.layer

data class UdpInfo(
    val srcPort: Int,
    val dstPort: Int,
    val length: Int,
    val checksum: Int,
    val data: String,
)
