package ru.nsu.ctf.paketnikback.domain.entity.rule

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document("rules")
data class RuleDocument(
    @Id val id: String? = null,
    val name: String,
    val type: RuleType,
    val regex: String,
    val scope: ScopeType,
)
