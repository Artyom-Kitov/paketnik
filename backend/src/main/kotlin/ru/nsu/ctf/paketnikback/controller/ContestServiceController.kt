package ru.nsu.ctf.paketnikback.controller

import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import ru.nsu.ctf.paketnikback.domain.dto.ContestServiceCreationRequest
import ru.nsu.ctf.paketnikback.domain.dto.ContestServiceResponse
import ru.nsu.ctf.paketnikback.domain.service.ContestServiceService

@RestController
@RequestMapping("/services")
class ContestServiceController(
    private val contestServiceService: ContestServiceService,
) {
    @PostMapping
    fun create(
        @RequestBody @Valid request: ContestServiceCreationRequest,
    ): ResponseEntity<ContestServiceResponse> = ResponseEntity.ok(contestServiceService.create(request))

    @GetMapping
    fun getAll() = ResponseEntity.ok(contestServiceService.getAll())

    @PutMapping
    fun update(
        @RequestParam id: String,
        @RequestBody @Valid request: ContestServiceCreationRequest,
    ): ResponseEntity<ContestServiceResponse> = ResponseEntity.ok(contestServiceService.update(id, request))

    @DeleteMapping
    fun delete(
        @RequestParam id: String,
    ): ResponseEntity<Unit> = ResponseEntity.ok(contestServiceService.deleteById(id))
}
