package ru.nsu.ctf.paketnikback.domain.service.rule

import ru.nsu.ctf.paketnikback.domain.dto.rule.RuleRequestDTO
import ru.nsu.ctf.paketnikback.domain.dto.rule.RuleResponseDTO

interface RuleService {
    fun getAllRules(): List<RuleResponseDTO>
    fun createRule(request: RuleRequestDTO): RuleResponseDTO
    fun updateRule(id: String, request: RuleRequestDTO): RuleResponseDTO
    fun deleteRule(id: String)
}
