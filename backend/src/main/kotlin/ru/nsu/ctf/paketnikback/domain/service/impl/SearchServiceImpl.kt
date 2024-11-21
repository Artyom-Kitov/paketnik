package ru.nsu.ctf.paketnikback.domain.service.impl

import org.springframework.stereotype.Service
import ru.nsu.ctf.paketnikback.domain.dto.SearchServiceRequest
import ru.nsu.ctf.paketnikback.domain.dto.SearchServiceResponse

import ru.nsu.ctf.paketnikback.domain.service.SearchService
import ru.nsu.ctf.paketnikback.utils.logger

@Service
class SearchServiceImpl(
) : SearchService {
    private val log = logger()

    override fun search(request: SearchServiceRequest): SearchServiceResponse {
        log.info("search by regex")

        // ...
        
        log.info("SEARCH_SUCCESS")
        log.info("DATA_NOT_FOUND")
        return SearchServiceResponse()
    }
}
