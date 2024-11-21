package ru.nsu.ctf.paketnikback.domain.dto

data class RegexSearchRequest(
    val filename: String,
    val regex: String,
)
