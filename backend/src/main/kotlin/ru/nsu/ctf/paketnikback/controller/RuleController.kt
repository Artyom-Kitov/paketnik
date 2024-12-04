package ru.nsu.ctf.paketnikback.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ru.nsu.ctf.paketnikback.domain.dto.rule.RuleRequestDTO
import ru.nsu.ctf.paketnikback.domain.dto.rule.RuleResponseDTO
import ru.nsu.ctf.paketnikback.domain.service.RuleService

@RestController
@RequestMapping("/rules")
class RuleController(
    private val ruleService: RuleService,
) {
    @Operation(
        summary = "Create a new rule with given parameters.",
        description = "Returns a new rule with given parameters and an ID generated on the server side.",
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Successfully created"),
            ApiResponse(responseCode = "400", description = "Invalid request"),
        ],
    )
    @PostMapping
    fun createRule(@RequestBody request: RuleRequestDTO): ResponseEntity<RuleResponseDTO> {
        val response = ruleService.createRule(request)
        return ResponseEntity.ok(response)
    }

    @Operation(
        summary = "Retrieve all rules.",
        description = "Returns a list of all available rules.",
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Successfully retrieved"),
        ],
    )
    @GetMapping
    fun getAllRules(): ResponseEntity<List<RuleResponseDTO>> {
        val rules = ruleService.getAllRules()
        return ResponseEntity.ok(rules)
    }

    @Operation(
        summary = "Update a rule.",
        description = "Returns a rule with new parameters.",
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Successfully updated"),
            ApiResponse(responseCode = "400", description = "Invalid request"),
            ApiResponse(responseCode = "404", description = "Rule with given ID not found"),
        ],
    )
    @PutMapping("/{id}")
    fun updateRule(
        @PathVariable id: String,
        @RequestBody request: RuleRequestDTO,
    ): ResponseEntity<RuleResponseDTO> {
        val response = ruleService.updateRule(id, request)
        return ResponseEntity.ok(response)
    }

    @Operation(
        summary = "Delete a rule by ID.",
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Successfully deleted"),
            ApiResponse(responseCode = "404", description = "Rule with given ID not found"),
        ],
    )
    @DeleteMapping("/{id}")
    fun deleteRule(@PathVariable id: String): ResponseEntity<Void> {
        ruleService.deleteRule(id)
        return ResponseEntity.noContent().build()
    }
}
