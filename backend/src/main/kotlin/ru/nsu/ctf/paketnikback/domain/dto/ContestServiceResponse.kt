package ru.nsu.ctf.paketnikback.domain.dto

data class ContestServiceResponse(
    val id: String,
    val name: String,
    val port: Int,
    val hexColor: String,
)
