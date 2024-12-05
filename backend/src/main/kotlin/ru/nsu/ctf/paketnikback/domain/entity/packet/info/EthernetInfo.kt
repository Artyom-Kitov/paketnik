package ru.nsu.ctf.paketnikback.domain.entity.packet.info

import io.pkts.protocol.Protocol

data class EthernetInfo(
    val srcMac: String,
    val dstMac: String,
) : PacketInfo(Protocol.ETHERNET_II.toString())
