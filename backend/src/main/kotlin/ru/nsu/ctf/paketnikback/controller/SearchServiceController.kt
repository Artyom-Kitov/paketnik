package ru.nsu.ctf.paketnikback.controller

import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

import ru.nsu.ctf.paketnikback.domain.dto.SearchServiceRequest
import ru.nsu.ctf.paketnikback.domain.dto.SearchServiceResponse
import ru.nsu.ctf.paketnikback.domain.service.SearchService

@RestController
@RequestMapping("/search")
class SearchServiceController(
    private val searchService: SearchService,
) {
    @PostMapping
    fun search(
        @RequestBody @Valid request: SearchServiceRequest,
    ): ResponseEntity<SearchServiceResponse> = ResponseEntity.ok(searchService.search(request))
}
