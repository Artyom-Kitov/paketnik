package ru.nsu.ctf.paketnikback.domain.entity.packet.layer

data class HttpInfo(
    val method: String?,
    val url: String?,
    val statusCode: Int?,   
    val headers: Map<String, String>,
    val body: String?,
)
