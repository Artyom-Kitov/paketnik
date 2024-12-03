package ru.nsu.ctf.paketnikback.domain.dto.rule

import ru.nsu.ctf.paketnikback.domain.entity.rule.RuleType
import ru.nsu.ctf.paketnikback.domain.entity.rule.ScopeType

data class RuleRequestDTO(
    val name: String,
    val type: RuleType,
    val regex: String,
    val scope: ScopeType,
)
