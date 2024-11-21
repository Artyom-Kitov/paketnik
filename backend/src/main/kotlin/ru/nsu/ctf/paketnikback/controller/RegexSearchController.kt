package ru.nsu.ctf.paketnikback.controller

import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.MethodArgumentNotValidException

import io.minio.MinioClient
import io.minio.errors.ErrorResponseException
import io.minio.StatObjectArgs
import io.minio.GetObjectArgs

import io.pkts.Pcap

import ru.nsu.ctf.paketnikback.exception.EntityNotFoundException
import ru.nsu.ctf.paketnikback.exception.InternalServerErrorException
import ru.nsu.ctf.paketnikback.domain.dto.RegexSearchRequest
import ru.nsu.ctf.paketnikback.domain.dto.RegexSearchResponse
import ru.nsu.ctf.paketnikback.utils.logger
import ru.nsu.ctf.paketnikback.utils.RegexSearchPcapHandler

@RestController
@RequestMapping("/search")
class RegexSearchController(
    private val minioClient: MinioClient
) {
    private val bucketName = "traffic-dumps"
    private val log = logger()
    
    @PostMapping
    fun search( @RequestBody @Valid request: RegexSearchRequest ): ResponseEntity<RegexSearchResponse> {
        var result = RegexSearchResponse()

        val filename = request.filename
        
        try {
            val regex = Regex(request.regex)
        } catch (e: Exception) {
            throw MethodArgumentNotValidException("ERR: Regex ${request.regex} not valid: ${e.message}")
        }

        val regex = Regex(request.regex)
        
        try {
            val stat = minioClient.statObject(
                StatObjectArgs.builder()
                    .bucket(bucketName)
                    .`object`(filename)
                    .build()
                )
        } catch (e: ErrorResponseException) {
            if (e.errorResponse().code() == "NoSuchKey") {
                throw EntityNotFoundException("ERR: File ${filename} not found")
            } else {
                throw InternalServerErrorException("ERR: Error while file searching")
            }
        }

        val file = minioClient.getObject(
            GetObjectArgs
                .builder()
                .bucket(bucketName)
                .`object`(filename)
                .build()
        )
        
        val pcap : Pcap? = try {
            Pcap.openStream(file)
        } catch (e: IOException) {
            throw InternalServerErrorException("ERR: Error while file opening")
        }
        
        val handler = RegexSearchPcapHandler(regex)
        
        pcap.loop(handler)
        pcap.close()
        
        result.matches = handler.getMatches()

        if (result.matches.isEmpty()) {
            log.info("DATA_NOT_FOUND")
        } else {
            log.info("SEARCH_SUCCESS")
        }

        return ResponseEntity(result, HttpStatus.OK)
    }
}
