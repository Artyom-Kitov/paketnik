package ru.nsu.ctf.paketnikback.domain.service

import ru.nsu.ctf.paketnikback.domain.dto.rule.RuleRequestDto
import ru.nsu.ctf.paketnikback.domain.dto.rule.RuleResponseDto
import ru.nsu.ctf.paketnikback.domain.entity.rule.Rule

interface RuleService {
    fun getAllRules(): List<RuleResponseDto>

    /**
     * Gets all rules as entity classes for using precompiled regular expressions.
     * 
     * @return List of Rules with precompiled regular expressions.
     */
    fun getAllRulesAsEntity(): List<Rule>

    fun createRule(request: RuleRequestDto): RuleResponseDto

    fun updateRule(id: String, request: RuleRequestDto): RuleResponseDto

    fun deleteRule(id: String)
}
