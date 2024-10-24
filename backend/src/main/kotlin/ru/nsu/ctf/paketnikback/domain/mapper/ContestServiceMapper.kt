package ru.nsu.ctf.paketnikback.domain.mapper

import org.mapstruct.Mapper
import org.mapstruct.Mapping
import ru.nsu.ctf.paketnikback.domain.document.ContestServiceDocument
import ru.nsu.ctf.paketnikback.domain.dto.service.ContestServiceCreationRequest
import ru.nsu.ctf.paketnikback.domain.dto.service.ContestServiceResponse

@Mapper(componentModel = "spring", imports = [java.util.UUID::class])
interface ContestServiceMapper {
    @Mapping(target = "id", expression = "java(UUID.randomUUID().toString())")
    fun toDocument(contestServiceCreationRequest: ContestServiceCreationRequest): ContestServiceDocument

    fun toResponse(contestServiceDocument: ContestServiceDocument): ContestServiceResponse
}
