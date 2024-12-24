package ru.nsu.ctf.paketnikback.domain.entity.packet

import ru.nsu.ctf.paketnikback.domain.entity.packet.layer.HttpInfo
import ru.nsu.ctf.paketnikback.domain.entity.packet.layer.LayersInfo
import java.time.Instant

data class PacketData(
    val receivedAt: Instant,
    val encodedData: String,
    val layers: LayersInfo,
    val tags: List<String>,
    val index: Int,
    val httpInfo: HttpInfo?,
)
