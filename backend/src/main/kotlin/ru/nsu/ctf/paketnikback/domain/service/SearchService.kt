package ru.nsu.ctf.paketnikback.domain.service

import ru.nsu.ctf.paketnikback.domain.dto.SearchServiceRequest
import ru.nsu.ctf.paketnikback.domain.dto.SearchServiceResponse

interface SearchService {
    fun search(request: SearchServiceRequest): SearchServiceResponse
}
