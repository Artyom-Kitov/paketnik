package ru.nsu.ctf.paketnikback.domain.entity.rule

data class Rule (
    val id: String? = null,
    val name: String,
    val type: RuleType,
    val regex: String,
    val scope: ScopeType
)
