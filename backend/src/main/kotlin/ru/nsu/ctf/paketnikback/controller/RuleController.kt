package ru.nsu.ctf.paketnikback.controller

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import ru.nsu.ctf.paketnikback.domain.dto.rule.RuleRequestDTO
import ru.nsu.ctf.paketnikback.domain.dto.rule.RuleResponseDTO
import ru.nsu.ctf.paketnikback.domain.service.rule.RuleService

@RestController
@RequestMapping("/rules")
class RuleController(
    private val ruleService: RuleService
) {

    @PostMapping
    fun createRule(@RequestBody request: RuleRequestDTO): ResponseEntity<RuleResponseDTO> {
        val response = ruleService.createRule(request)
        return ResponseEntity.ok(response)
    }

    @GetMapping
    fun getAllRules(): ResponseEntity<List<RuleResponseDTO>> {
        val rules = ruleService.getAllRules()
        return ResponseEntity.ok(rules)
    }

    @PutMapping("/{id}")
    fun updateRule(
        @PathVariable id: String,
        @RequestBody request: RuleRequestDTO
    ): ResponseEntity<RuleResponseDTO> {
        val response = ruleService.updateRule(id, request)
        return ResponseEntity.ok(response)
    }

    @DeleteMapping("/{id}")
    fun deleteRule(@PathVariable id: String): ResponseEntity<Void> {
        ruleService.deleteRule(id)
        return ResponseEntity.noContent().build()
    }
}

