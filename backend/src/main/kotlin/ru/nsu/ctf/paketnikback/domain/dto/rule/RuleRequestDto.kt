package ru.nsu.ctf.paketnikback.domain.dto.rule

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size
import ru.nsu.ctf.paketnikback.domain.dto.rule.validation.ValidRegex
import ru.nsu.ctf.paketnikback.domain.entity.rule.RuleType
import ru.nsu.ctf.paketnikback.domain.entity.rule.ScopeType

data class RuleRequestDto(
    @field:NotBlank(message = "Rule name cannot be blank")
    @field:Size(min = 1, max = 100, message = "Name must be between 1 and 100 symbols long")
    val name: String,
    
    val type: RuleType,
    
    @field:NotBlank(message = "Rule regex cannot be blank")
    @field:NotNull(message = "Regex cannot be null")
    @field:Size(min = 1, max = 200, message = "Regex must be between 1 and 200 symbols long")
    @field:ValidRegex(message = "Regex must be valid")
    val regex: String,
    
    val scope: ScopeType,
)
