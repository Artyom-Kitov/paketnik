package ru.nsu.ctf.paketnikback.domain.mapper

import org.mapstruct.Mapper
import org.mapstruct.Mapping
import org.mapstruct.Named
import ru.nsu.ctf.paketnikback.domain.dto.rule.RuleRequestDTO
import ru.nsu.ctf.paketnikback.domain.dto.rule.RuleResponseDTO
import ru.nsu.ctf.paketnikback.domain.entity.rule.Rule
import ru.nsu.ctf.paketnikback.domain.entity.rule.RuleDocument
import java.util.regex.Pattern

@Mapper(componentModel = "spring")
interface RuleMapper {
    @Mapping(target = "id", source = "id")
    @Mapping(target = "regex", source = "regex", qualifiedByName = ["stringToPattern"])
    fun toDomain(ruleDocument: RuleDocument): Rule

    @Mapping(target = "id", source = "id")
    @Mapping(target = "regex", source = "regex", qualifiedByName = ["patternToString"])
    fun toDocument(rule: Rule): RuleDocument

    @Mapping(target = "id", source = "id")
    @Mapping(target = "regex", source = "regex", qualifiedByName = ["patternToString"])
    fun toResponseDTO(rule: Rule): RuleResponseDTO

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "regex", source = "regex", qualifiedByName = ["stringToPattern"])
    fun toDomainFromRequest(requestDTO: RuleRequestDTO): Rule

    companion object {
        @JvmStatic
        @Named("stringToPattern")
        fun stringToPattern(regex: String): Pattern = Pattern.compile(regex)

        @JvmStatic
        @Named("patternToString")
        fun patternToString(pattern: Pattern): String = pattern.pattern()
    }
}
