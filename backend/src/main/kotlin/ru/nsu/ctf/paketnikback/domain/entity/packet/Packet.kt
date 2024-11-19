package ru.nsu.ctf.paketnikback.domain.entity.packet

data class Packet(
    val rawData: ByteArray,
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as Packet

        return rawData.contentEquals(other.rawData)
    }

    override fun hashCode(): Int = rawData.contentHashCode()
}
