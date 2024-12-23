package ru.nsu.ctf.paketnikback.domain.entity.packet.layer

data class TcpInfo(
    val srcPort: Int,
    val dstPort: Int,
    val sequenceNumber: Long,
    val ackNumber: Long,
    val dataOffset: Int,
    
    val cwr: Boolean,
    val ece: Boolean,
    val urg: Boolean,
    val ack: Boolean,
    val psh: Boolean,
    val rst: Boolean,
    val syn: Boolean,
    val fin: Boolean,
    
    val windowSize: Int,
    val checksum: Int,
    val urgentPointer: Int,
    val data: String,
)
