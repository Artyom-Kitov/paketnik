package ru.nsu.ctf.paketnikback.domain.mapper

import org.mapstruct.Mapper
import org.mapstruct.Mapping
import ru.nsu.ctf.paketnikback.domain.dto.ContestServiceCreationRequest
import ru.nsu.ctf.paketnikback.domain.dto.ContestServiceResponse
import ru.nsu.ctf.paketnikback.domain.entity.contest.ContestServiceDocument

@Mapper(componentModel = "spring", imports = [java.util.UUID::class])
interface ContestServiceMapper {
    @Mapping(target = "id", expression = "java(UUID.randomUUID().toString())")
    fun toDocument(contestServiceCreationRequest: ContestServiceCreationRequest): ContestServiceDocument

    fun toResponse(contestServiceDocument: ContestServiceDocument): ContestServiceResponse
}
