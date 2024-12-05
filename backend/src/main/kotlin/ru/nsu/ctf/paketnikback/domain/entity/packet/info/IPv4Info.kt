package ru.nsu.ctf.paketnikback.domain.entity.packet.info

import io.pkts.protocol.Protocol

data class IPv4Info(
    val version: Byte,
    val length: Int,
    val doNotFragment: Boolean,
    val moreFragments: Boolean,
    val fragmentOffset: Int,
    val ttl: Int,
    val protocol: String,
    val headerChecksum: Int,
    val srcIp: String,
    val dstIp: String,
) : PacketInfo(Protocol.IPv4.toString())
