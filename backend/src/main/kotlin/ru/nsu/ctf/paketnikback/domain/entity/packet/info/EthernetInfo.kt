package ru.nsu.ctf.paketnikback.domain.entity.packet.info

data class EthernetInfo(
    val srcMac: String,
    val dstMac: String,
) : PacketInfo()
