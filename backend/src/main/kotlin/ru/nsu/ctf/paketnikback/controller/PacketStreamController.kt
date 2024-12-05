package ru.nsu.ctf.paketnikback.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
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
    @Operation(
        summary = "Get all streams infos",
        description = "Returns all streams infos without packets",
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Successfully retrieved"),
        ],
    )
    @GetMapping("/infos")
    fun getAll() = ResponseEntity.ok(packetStreamService.getAllStreams())

    @Operation(
        summary = "Get stream packets",
        description = "Returns all packets that belong to the given stream. " +
                "Packet raw data is encoded in Base64 format. " +
                "In info field there are fields depending on the protocol.",
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Successfully retrieved"),
            ApiResponse(responseCode = "404", description = "Given stream not found"),
        ],
    )
    @GetMapping("/packets")
    fun getByStreamId(@RequestParam id: String) = ResponseEntity.ok(packetStreamService.getStreamPackets(id))

    @Operation(
        summary = "Get unallocated packets",
        description = "Returns all packets that don't belong to any stream"
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Successfully retrieved")
        ]
    )
    @GetMapping("/unallocated")
    fun getUnallocated() = ResponseEntity.ok(packetStreamService.getUnallocated())
}
