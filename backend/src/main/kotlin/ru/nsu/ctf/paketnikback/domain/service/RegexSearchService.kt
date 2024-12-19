package ru.nsu.ctf.paketnikback.domain.service

import ru.nsu.ctf.paketnikback.domain.dto.RegexSearchRequest
import ru.nsu.ctf.paketnikback.domain.dto.RegexSearchResponse

interface RegexSearchService {
    fun search(request: RegexSearchRequest): RegexSearchResponse
}
