package ru.nsu.ctf.paketnikback.domain.service

import ru.nsu.ctf.paketnikback.domain.dto.ContestServiceCreationRequest
import ru.nsu.ctf.paketnikback.domain.dto.ContestServiceResponse

interface ContestServiceService {
    fun getAll(): List<ContestServiceResponse>

    fun create(request: ContestServiceCreationRequest): ContestServiceResponse

    fun update(id: String, request: ContestServiceCreationRequest): ContestServiceResponse

    fun deleteById(id: String)
}
