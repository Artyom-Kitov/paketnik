package ru.nsu.ctf.paketnikback.domain.dto

data class RegexSearchResponse(
    val matches: List<Triple<Int, String, Int>>,
)
