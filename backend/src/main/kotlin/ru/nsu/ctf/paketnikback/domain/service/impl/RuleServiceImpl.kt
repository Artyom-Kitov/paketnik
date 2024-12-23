package ru.nsu.ctf.paketnikback.domain.service.impl

import org.springframework.stereotype.Service
import ru.nsu.ctf.paketnikback.domain.dto.rule.RuleRequestDto
import ru.nsu.ctf.paketnikback.domain.dto.rule.RuleResponseDto
import ru.nsu.ctf.paketnikback.domain.entity.rule.Rule
import ru.nsu.ctf.paketnikback.domain.mapper.RuleMapper
import ru.nsu.ctf.paketnikback.domain.repository.RuleRepository
import ru.nsu.ctf.paketnikback.domain.service.RuleService
import ru.nsu.ctf.paketnikback.exception.EntityNotFoundException
import ru.nsu.ctf.paketnikback.exception.InvalidEntityException
import ru.nsu.ctf.paketnikback.utils.logger
import java.util.regex.Pattern
import java.util.regex.PatternSyntaxException

/**
 * A service implementation class for rules.
 * 
 * Provides methods to create, retrieve, update and delete rules using RuleRepository interface.
 * 
 * ВНИМАНИЕ!
 * При изменении, добавлении или удалении правил необходимо потом обновить метки для всех стримов в соответствии с
 * требованием "Обновление списка стримов после изменения фильтров (правил) или сервисов".
 * Добавьте обновление меток, если вы делаете это задание!
 * 
 * @see RuleRepository
 */
@Service
class RuleServiceImpl(
    private val ruleRepository: RuleRepository,
    private val ruleMapper: RuleMapper,
) : RuleService {
    private val log = logger()

    override fun getAllRules(): List<RuleResponseDto> {
        log.info("getting all rules to generate a response")
        val ruleDocuments = ruleRepository.findAll()
        log.info("successfully retrieved ${ruleDocuments.size} rules from MongoDB to generate a response.")
        return ruleDocuments.map { ruleMapper.toResponseDTO(ruleMapper.toDomain(it)) }
    }

    override fun getAllRulesAsEntity(): List<Rule> {
        log.info("getting all rules to generate entities")
        val ruleDocuments = ruleRepository.findAll()
        log.info("successfully retrieved ${ruleDocuments.size} rules from MongoDB to generate entities.")
        return ruleDocuments.map { ruleMapper.toDomain(it) }
    }

    override fun createRule(request: RuleRequestDto): RuleResponseDto {
        validateRuleRequest(request)
        
        log.info("creating a rule from request $request")
        val rule = ruleMapper.toDomainFromRequest(request)
        val savedDocument = ruleRepository.save(ruleMapper.toDocument(rule))
        log.info("successfully created a new rule from request $request")
        return ruleMapper.toResponseDTO(ruleMapper.toDomain(savedDocument))
    }

    override fun updateRule(id: String, request: RuleRequestDto): RuleResponseDto {
        log.info("looking for a rule with id $id to update")
        if (!ruleRepository.existsById(id)) {
            throw EntityNotFoundException("Rule with ID $id not found")
        }
        
        validateRuleRequest(request)

        log.info("updating a rule with id $id")
        val updatedRule = ruleMapper.toDomainFromRequest(request).copy(id = id)
        val savedDocument = ruleRepository.save(ruleMapper.toDocument(updatedRule))
        log.info("successfully updated a rule with id $id")
        return ruleMapper.toResponseDTO(ruleMapper.toDomain(savedDocument))
    }

    override fun deleteRule(id: String) {
        log.info("looking for a rule with id $id to delete")
        if (!ruleRepository.existsById(id)) {
            throw EntityNotFoundException("Rule with ID $id not found")
        }
        log.info("rule with id $id has been successfully deleted")
        ruleRepository.deleteById(id)
    }

    private fun validateRuleRequest(request: RuleRequestDto) {
        log.info("validating a request: $request")
        if (request.name.isBlank()) {
            throw InvalidEntityException("Rule name cannot be empty")
        }

        try {
            Pattern.compile(request.regex)
        } catch (e: PatternSyntaxException) {
            throw InvalidEntityException("Invalid regex (couldn't compile): ${request.regex}")
        }
        log.info("request $request successfully validated")
    }
}
