package ru.nsu.ctf.paketnikback.domain.repository

import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository
import ru.nsu.ctf.paketnikback.domain.document.ContestServiceDocument

@Repository
interface ContestServiceRepository : MongoRepository<ContestServiceDocument, String>