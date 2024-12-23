package ru.nsu.ctf.paketnikback.domain.dto.rule.validation

import jakarta.validation.Constraint
import kotlin.reflect.KClass

@Target(AnnotationTarget.FIELD)
@Retention(AnnotationRetention.RUNTIME)
@Constraint(validatedBy = [RegexValidator::class])
annotation class ValidRegex(
    val message: String = "Некорректное регулярное выражение",
    val groups: Array<KClass<*>> = [],
    val payload: Array<KClass<out Any>> = [],
)
