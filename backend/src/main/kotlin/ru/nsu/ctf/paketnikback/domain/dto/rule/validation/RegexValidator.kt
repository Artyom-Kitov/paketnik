package ru.nsu.ctf.paketnikback.domain.dto.rule.validation

import jakarta.validation.ConstraintValidator
import jakarta.validation.ConstraintValidatorContext
import java.util.regex.PatternSyntaxException

class RegexValidator : ConstraintValidator<ValidRegex, String> {
    override fun isValid(value: String?, context: ConstraintValidatorContext): Boolean {
        if (value == null) return false
        return try {
            Regex(value)
            true
        } catch (e: PatternSyntaxException) {
            false
        }
    }
}
