package ru.nsu.ctf.paketnikback.domain.service

import ru.nsu.ctf.paketnikback.domain.dto.rule.RuleRequestDTO
import ru.nsu.ctf.paketnikback.domain.dto.rule.RuleResponseDTO
import ru.nsu.ctf.paketnikback.domain.entity.rule.Rule

interface RuleService {
    fun getAllRules(): List<RuleResponseDTO>

    /**
     * Gets all rules as entity classes for using precompiled regular expressions.
     * 
     * @return List of Rules with precompiled regular expressions.
     */
    fun getAllRulesAsEntity(): List<Rule>
    fun createRule(request: RuleRequestDTO): RuleResponseDTO
    fun updateRule(id: String, request: RuleRequestDTO): RuleResponseDTO
    fun deleteRule(id: String)
}
