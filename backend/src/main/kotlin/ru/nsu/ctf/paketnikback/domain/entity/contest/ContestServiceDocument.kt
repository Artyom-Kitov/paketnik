package ru.nsu.ctf.paketnikback.domain.entity.contest

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.util.UUID

@Document(collection = "services")
data class ContestServiceDocument(
    @Id
    val id: String = UUID.randomUUID().toString(),

    val name: String,

    val port: Int,

    val hexColor: String,
)
