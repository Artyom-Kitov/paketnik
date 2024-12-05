package ru.nsu.ctf.paketnikback.domain.entity.packet.layer

data class IPv4Info(
    val version: Byte,
    val length: Int,
    val doNotFragment: Boolean,
    val moreFragments: Boolean,
    val fragmentOffset: Int,
    val ttl: Int,
    val headerChecksum: Int,
    val srcIp: String,
    val dstIp: String,
)
