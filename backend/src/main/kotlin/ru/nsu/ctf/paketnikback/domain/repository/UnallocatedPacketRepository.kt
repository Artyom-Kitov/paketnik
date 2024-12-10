package ru.nsu.ctf.paketnikback.domain.repository

import org.springframework.data.mongodb.repository.MongoRepository
import ru.nsu.ctf.paketnikback.domain.entity.packet.UnallocatedPacketDocument

interface UnallocatedPacketRepository : MongoRepository<UnallocatedPacketDocument, String>
