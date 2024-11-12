package ru.nsu.ctf.paketnikback.domain.dto

import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.Size

data class ContestServiceCreationRequest(
    @Size(min = 1, max = 64, message = "Name must be between 1 and 64 characters")
    val name: String,

    @Min(1, message = "Port must be at least 1")
    @Max(65535, message = "Port must be at most 65535")
    val port: Int,
    
    val hexColor: String,
)
