package ru.nsu.ctf.paketnikback.domain.dto

data class RegexSearchResponse(
    var matches: List<Triple<Int, String, Int>>,
)
