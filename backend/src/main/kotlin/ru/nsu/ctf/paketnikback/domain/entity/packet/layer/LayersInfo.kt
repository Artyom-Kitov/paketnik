package ru.nsu.ctf.paketnikback.domain.entity.packet.layer

data class LayersInfo(
    val ethernet: EthernetInfo?,
    val ipv4: IPv4Info?,
    val tcp: TcpInfo?,
    val udp: UdpInfo?,
)
