package ru.nsu.ctf.paketnikback.domain.repository

import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository
import ru.nsu.ctf.paketnikback.domain.entity.contest.ContestServiceDocument
import java.util.*

@Repository
interface ContestServiceRepository : MongoRepository<ContestServiceDocument, String> {
    fun findByPort(port: Int): Optional<ContestServiceDocument>
}
