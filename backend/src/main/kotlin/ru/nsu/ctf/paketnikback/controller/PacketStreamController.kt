package ru.nsu.ctf.paketnikback.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
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
        summary = "Get all stream data",
        description = "Returns all data including packets that belong to the given stream. " +
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
    
    @GetMapping("/export-request")
    fun exportRequest(
        @RequestParam streamId: String,
        @RequestParam packetIndex: Int,
        @RequestParam format: String
    ): ResponseEntity<Map<String, String>> {
        val export = packetStreamService.exportHttpRequest(streamId, packetIndex, format)
        return ResponseEntity.ok(mapOf("export" to export))
    }

    @Operation(
        summary = "Get all stream http data",
        description = "Returns all http data from packets in given stream including:\n" +
                "- HTTP method\n" +
                "- URL\n" +
                "- Status code\n" +
                "- Headers\n" +
                "- Body",
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Successfully retrieved"),
            ApiResponse(responseCode = "404", description = "Given stream not found"),
        ],
    )
    @GetMapping("/http")
    fun getHttpInfoByStreamId(@RequestParam id: String) = ResponseEntity.ok(packetStreamService.getStreamHttpInfo(id))

    @Operation(
        summary = "Get unallocated packets",
        description = "Returns all packets that don't belong to any stream",
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Successfully retrieved"),
        ],
    )
    @GetMapping("/unallocated")
    fun getUnallocated() = ResponseEntity.ok(packetStreamService.getUnallocated())
}
