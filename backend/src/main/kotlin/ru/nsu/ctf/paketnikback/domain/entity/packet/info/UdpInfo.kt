package ru.nsu.ctf.paketnikback.domain.entity.packet.info

import io.pkts.protocol.Protocol

data class UdpInfo(
    val srcPort: Int,
    val dstPort: Int,
    val length: Int,
    val checksum: Int,
    val data: String,
) : PacketInfo(Protocol.UDP.toString())
