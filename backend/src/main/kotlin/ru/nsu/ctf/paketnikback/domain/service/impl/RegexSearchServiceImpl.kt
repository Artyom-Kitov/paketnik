package ru.nsu.ctf.paketnikback.domain.service.impl

import org.springframework.stereotype.Service

import io.pkts.Pcap

import ru.nsu.ctf.paketnikback.domain.dto.RegexSearchRequest
import ru.nsu.ctf.paketnikback.domain.dto.RegexSearchResponse
import ru.nsu.ctf.paketnikback.domain.service.RegexSearchService

import ru.nsu.ctf.paketnikback.utils.logger
import ru.nsu.ctf.paketnikback.utils.RegexSearchPcapHandler

@Service
class RegexSearchServiceImpl(
) : RegexSearchService {
    private val log = logger()

    override fun search(request: RegexSearchRequest): RegexSearchResponse {
        // need to be implemented
        return RegexSearchResponse([])
    }
}
