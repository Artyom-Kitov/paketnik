package ru.nsu.ctf.paketnikback.domain.entity.rule

import java.util.regex.Pattern

data class Rule (
    val id: String? = null,
    val name: String,
    val type: RuleType,
    val regex: Pattern,
    val scope: ScopeType
)
