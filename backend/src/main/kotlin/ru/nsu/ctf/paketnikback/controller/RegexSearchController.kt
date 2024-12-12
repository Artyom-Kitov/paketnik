package ru.nsu.ctf.paketnikback.controller

import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

import ru.nsu.ctf.paketnikback.domain.dto.RegexSearchRequest
import ru.nsu.ctf.paketnikback.domain.dto.RegexSearchResponse
import ru.nsu.ctf.paketnikback.domain.service.RegexSearchService

@RestController
@RequestMapping("/search")
class RegexSearchController(
    private val regexSearchService: RegexSearchService,
) {
    @PostMapping
    fun search(
        @RequestBody @Valid request: RegexSearchRequest 
    ): ResponseEntity<RegexSearchResponse> = ResponseEntity.ok(regexSearchService.search(request))
}
