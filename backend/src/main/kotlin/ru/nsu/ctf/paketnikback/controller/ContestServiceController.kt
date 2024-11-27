package ru.nsu.ctf.paketnikback.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
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
    @Operation(
        summary = "Create a new contest service with given parameters. Note that hexColor parameter " +
            "is a HEX color representation, but it's not checked at the server side",
        description = "Returns the created service with its UUID",
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Successfully created"),
            ApiResponse(responseCode = "400", description = "Invalid request"),
        ],
    )
    @PostMapping
    fun create(
        @RequestBody @Valid request: ContestServiceCreationRequest,
    ): ResponseEntity<ContestServiceResponse> = ResponseEntity.ok(contestServiceService.create(request))

    @Operation(
        summary = "Retrieve all contest services",
        description = "Returns all available contest services",
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Successfully retrieved"),
        ],
    )
    @GetMapping
    fun getAll() = ResponseEntity.ok(contestServiceService.getAll())

    @Operation(
        summary = "Edit contest service",
        description = "Returns contest service with new parameters",
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Successfully edited"),
            ApiResponse(responseCode = "400", description = "Invalid request"),
            ApiResponse(responseCode = "404", description = "Service with given ID not found"),
        ],
    )
    @PutMapping
    fun update(
        @RequestParam id: String,
        @RequestBody @Valid request: ContestServiceCreationRequest,
    ): ResponseEntity<ContestServiceResponse> = ResponseEntity.ok(contestServiceService.update(id, request))

    @Operation(
        summary = "Delete contest service by UUID",
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Successfully deleted"),
            ApiResponse(responseCode = "404", description = "Service with given UUID does not exist"),
        ],
    )
    @DeleteMapping
    fun delete(
        @RequestParam id: String,
    ): ResponseEntity<Unit> = ResponseEntity.ok(contestServiceService.deleteById(id))
}
