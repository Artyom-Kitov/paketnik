package ru.nsu.ctf.paketnikback.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ru.nsu.ctf.paketnikback.domain.dto.RegexSearchRequest
import ru.nsu.ctf.paketnikback.domain.dto.RegexSearchResponse
import ru.nsu.ctf.paketnikback.domain.service.RegexSearchService
import ru.nsu.ctf.paketnikback.utils.logger

@RestController
@RequestMapping("/search")
class RegexSearchController(
    private val regexSearchService: RegexSearchService,
) {
    private val log = logger()

    @Operation(
        summary = "Search by regex in given pcap.",
        description = "Result of search by regex - list of matches with packet number, match string and offset in packet",
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Success"),
            ApiResponse(responseCode = "204", description = "No content found"),
            ApiResponse(responseCode = "400", description = "Invalid request"),
            ApiResponse(responseCode = "404", description = "Pcap file not found"),
        ],
    )
    @PostMapping
    fun search(@RequestBody request: RegexSearchRequest): ResponseEntity<RegexSearchResponse> {
        val response = regexSearchService.search(request)

        if (response.matches.isEmpty()) {
            log.info("DATA_NOT_FOUND")
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build()
        }
        
        log.info("SEARCH_SUCCESS")
        return ResponseEntity.ok(response) 
    }
}
