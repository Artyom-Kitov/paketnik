package ru.nsu.ctf.paketnikback.domain.service.rule.impl

import org.springframework.stereotype.Service
import ru.nsu.ctf.paketnikback.domain.dto.rule.RuleRequestDTO
import ru.nsu.ctf.paketnikback.domain.dto.rule.RuleResponseDTO
import ru.nsu.ctf.paketnikback.domain.entity.rule.Rule
import ru.nsu.ctf.paketnikback.domain.repository.RuleRepository
import ru.nsu.ctf.paketnikback.domain.service.rule.RuleService

// ВНИМАНИЕ!
// При изменении, добавлении или удалении правил необходимо потом обновить метки для всех стримов в соответствии с 
// требованием "Обновление списка стримов после изменения фильтров (правил) или сервисов".
// Добавьте обновление меток, если вы делаете это задание!
// ВНИМАНИЕ!
@Service
class RuleServiceImpl(
    private val ruleRepository: RuleRepository
): RuleService {
    override fun getAllRules(): List<RuleResponseDTO> {
        return ruleRepository.findAll().map { it.toResponseDTO() }
    }

    override fun createRule(request: RuleRequestDTO): RuleResponseDTO {
        if (!validateRuleRegex(request)) {
            throw IllegalArgumentException("Regex is invalid")
        }

        val rule = Rule(
            name = request.name,
            type = request.type,
            regex = request.regex,
            scope = request.scope
        )
        val savedRule = ruleRepository.save(rule)
        return savedRule.toResponseDTO()
    }

    override fun updateRule(id: String, request: RuleRequestDTO): RuleResponseDTO {
        val existingRule = ruleRepository.findById(id).orElseThrow {
            IllegalArgumentException("Rule with ID $id not found") 
        }
        
        if (!validateRuleRegex(request)) {
            throw IllegalArgumentException("Regex is invalid")
        }
        
        val updatedRule = existingRule.copy(
            name = request.name,
            type = request.type,
            regex = request.regex,
            scope = request.scope
        )
        ruleRepository.save(updatedRule)
        return updatedRule.toResponseDTO()
    }

    override fun deleteRule(id: String) {
        if (!ruleRepository.existsById(id)) {
            throw IllegalArgumentException("Rule with ID $id not found")
        }
        ruleRepository.deleteById(id)
    }
    
    private fun validateRuleRegex(rule: RuleRequestDTO): Boolean {
        TODO("Not yet implemented")
    }

    private fun Rule.toResponseDTO() = RuleResponseDTO(
        id = this.id ?: throw IllegalStateException("Rule ID is null"),
        name = this.name,
        type = this.type,
        regex = this.regex,
        scope = this.scope
    )
}
