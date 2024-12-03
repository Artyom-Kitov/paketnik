package ru.nsu.ctf.paketnikback.controller

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import ru.nsu.ctf.paketnikback.domain.service.PacketStreamService

@RestController
@RequestMapping("/streams")
class PacketStreamController(
    private val packetStreamService: PacketStreamService,
) {
    @GetMapping
    fun getAll() = ResponseEntity.ok(packetStreamService.getAllStreams())
    
    @GetMapping
    fun getByStreamId(@RequestParam id: String) = ResponseEntity.ok(packetStreamService.getStreamPackets(id))
    
    @GetMapping("/unallocated")
    fun getUnallocated() = ResponseEntity.ok(packetStreamService.getUnallocated())
}
