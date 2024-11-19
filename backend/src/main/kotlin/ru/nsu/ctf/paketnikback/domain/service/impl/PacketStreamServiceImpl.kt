package ru.nsu.ctf.paketnikback.domain.service.impl

import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.data.mongodb.core.query.Criteria
import org.springframework.data.mongodb.core.query.Query
import org.springframework.data.mongodb.core.query.Update
import org.springframework.stereotype.Service
import ru.nsu.ctf.paketnikback.domain.entity.packet.Packet
import ru.nsu.ctf.paketnikback.domain.entity.stream.PacketStream
import ru.nsu.ctf.paketnikback.domain.entity.stream.PacketStreamDocument
import ru.nsu.ctf.paketnikback.domain.repository.PacketStreamRepository
import ru.nsu.ctf.paketnikback.domain.service.PacketStreamService
import ru.nsu.ctf.paketnikback.utils.logger

@Service
class PacketStreamServiceImpl(
    private val packetStreamRepository: PacketStreamRepository,
    private val mongoTemplate: MongoTemplate,
) : PacketStreamService {
    private val log = logger()

    override fun addPackets(stream: PacketStream, packets: List<Packet>) {
        if (packetStreamRepository.existsById(stream)) {
            log.info("adding ${packets.size} packets to $stream")
            addToExisting(stream, packets)
            log.info("added ${packets.size} packets to $stream")
        } else {
            log.info("creating a new $stream with ${packets.size} packets")
            createStream(stream, packets)
            log.info("created a new $stream with ${packets.size} packets")
        }
    }

    override fun getAllStreams(): List<PacketStreamDocument> = packetStreamRepository.findAll()

    private fun addToExisting(stream: PacketStream, packets: List<Packet>) {
        val update = Update().push("packets").each(packets)
        mongoTemplate.updateFirst(
            Query.query(Criteria.where("stream").`is`(stream)),
            update,
            PacketStreamDocument::class.java,
        )
    }

    private fun createStream(stream: PacketStream, packets: List<Packet>) {
        val packetStream = PacketStreamDocument(stream, packets)
        packetStreamRepository.save(packetStream)
    }
}
