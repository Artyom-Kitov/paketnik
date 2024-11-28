package ru.nsu.ctf.paketnikback.domain.service.rule.impl

import org.springframework.stereotype.Service
import ru.nsu.ctf.paketnikback.domain.dto.rule.RuleRequestDTO
import ru.nsu.ctf.paketnikback.domain.dto.rule.RuleResponseDTO
import ru.nsu.ctf.paketnikback.domain.entity.rule.Rule
import ru.nsu.ctf.paketnikback.domain.mapper.RuleMapper
import ru.nsu.ctf.paketnikback.domain.repository.RuleRepository
import ru.nsu.ctf.paketnikback.domain.service.rule.RuleService
import java.util.regex.Pattern
import java.util.regex.PatternSyntaxException

// ВНИМАНИЕ!
// При изменении, добавлении или удалении правил необходимо потом обновить метки для всех стримов в соответствии с 
// требованием "Обновление списка стримов после изменения фильтров (правил) или сервисов".
// Добавьте обновление меток, если вы делаете это задание!
// ВНИМАНИЕ!
@Service
class RuleServiceImpl(
    private val ruleRepository: RuleRepository,
    private val ruleMapper: RuleMapper
): RuleService {
    override fun getAllRules(): List<RuleResponseDTO> {
        val ruleDocuments = ruleRepository.findAll()
        return ruleDocuments.map { ruleMapper.toResponseDTO(ruleMapper.toDomain(it)) }
    }
    
    override fun getAllRulesAsEntity(): List<Rule> {
        val ruleDocuments = ruleRepository.findAll()
        return ruleDocuments.map { ruleMapper.toDomain(it) }
    }

    override fun createRule(request: RuleRequestDTO): RuleResponseDTO {
        validateRuleRequest(request)
        
        val rule = ruleMapper.toDomainFromRequest(request)
        val savedDocument = ruleRepository.save(ruleMapper.toDocument(rule))
        
        return ruleMapper.toResponseDTO(ruleMapper.toDomain(savedDocument))
    }

    override fun updateRule(id: String, request: RuleRequestDTO): RuleResponseDTO {
        ruleRepository.findById(id).orElseThrow {
            IllegalArgumentException("Rule with ID $id not found")
        }

        validateRuleRequest(request)

        val updatedRule = ruleMapper.toDomainFromRequest(request).copy(id = id)
        val savedDocument = ruleRepository.save(ruleMapper.toDocument(updatedRule))

        return ruleMapper.toResponseDTO(ruleMapper.toDomain(savedDocument))
    }

    override fun deleteRule(id: String) {
        if (!ruleRepository.existsById(id)) {
            throw IllegalArgumentException("Rule with ID $id not found")
        }
        ruleRepository.deleteById(id)
    }

    private fun validateRuleRequest(request: RuleRequestDTO) {
        if (request.name.isBlank()) {
            throw IllegalArgumentException("Rule name cannot be empty")
        }

        try {
            Pattern.compile(request.regex)
        } catch (e: PatternSyntaxException) {
            throw IllegalArgumentException("Invalid regex: ${request.regex}")
        }
    }
}
