package ru.nsu.ctf.paketnikback.domain.entity.packet

import ru.nsu.ctf.paketnikback.domain.entity.packet.info.PacketInfo
import java.time.Instant

data class PacketData(
    val receivedAt: Instant,
    val protocol: String,
    val encodedData: String,
    val info: List<PacketInfo>,
    val tags: List<String>,
) {
    inline fun <reified T : PacketInfo> getInfo(): T = info.filterIsInstance<T>().first()
}
