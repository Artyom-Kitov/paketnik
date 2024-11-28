package ru.nsu.ctf.paketnikback.domain.service.rule

import ru.nsu.ctf.paketnikback.domain.dto.rule.RuleRequestDTO
import ru.nsu.ctf.paketnikback.domain.dto.rule.RuleResponseDTO
import ru.nsu.ctf.paketnikback.domain.entity.rule.Rule

interface RuleService {
    fun getAllRules(): List<RuleResponseDTO>
    fun getAllRulesAsEntity(): List<Rule> // Must be used when you want to get rules with precompiled regexes.
    fun createRule(request: RuleRequestDTO): RuleResponseDTO
    fun updateRule(id: String, request: RuleRequestDTO): RuleResponseDTO
    fun deleteRule(id: String)
}
