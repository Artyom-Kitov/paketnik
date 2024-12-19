package ru.nsu.ctf.paketnikback.domain.dto

data class RegexSearchMatch(
    val packet: Int,
    val string: String,
    val offset: Int,
)
