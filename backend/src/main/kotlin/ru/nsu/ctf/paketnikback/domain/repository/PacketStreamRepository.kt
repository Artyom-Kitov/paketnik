package ru.nsu.ctf.paketnikback.domain.repository

import org.springframework.data.mongodb.repository.MongoRepository
import ru.nsu.ctf.paketnikback.domain.entity.stream.PacketStreamDocument

interface PacketStreamRepository : MongoRepository<PacketStreamDocument, String> {
    fun findAllByPcapId(pcapId: String): List<PacketStreamDocument>
    fun deleteByPcapId(pcapId: String)
}
