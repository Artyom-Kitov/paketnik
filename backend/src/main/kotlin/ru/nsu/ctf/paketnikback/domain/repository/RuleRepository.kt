package ru.nsu.ctf.paketnikback.domain.repository

import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository
import ru.nsu.ctf.paketnikback.domain.entity.rule.RuleDocument

@Repository
interface RuleRepository: MongoRepository<RuleDocument, String>
