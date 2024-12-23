package ru.nsu.ctf.paketnikback.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RequestPart
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody
import ru.nsu.ctf.paketnikback.domain.service.MinioService

@RestController
@RequestMapping("/minio-api")
class FileUploadController(
    private val minioService: MinioService,
) {
    @Operation(
        summary = "Create new bucket and set 'currently in use' to it",
        description = "Try create bucket and return status code",
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Succesfully created"),
            ApiResponse(responseCode = "500", description = "Creating error"),
        ],
    )
    @PostMapping("/create-bucket")
    fun createBucket(@RequestParam("New-Bucket-Name") name: String): ResponseEntity<String> {
        val result = minioService.createBucket(name)
        return ResponseEntity(result.message, result.status)
    }

    @Operation(
        summary = "Get all file names",
        description = "Return all names of buckets and files inside them",
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Succesfully received all bucket and file names"),
            ApiResponse(responseCode = "500", description = "Error receiving files"),
        ],
    )
    @GetMapping("/get-files")
    fun getUploadedFiles(): ResponseEntity<Map<String, List<String>>> {
        val result = minioService.getUploadedFiles()
        return ResponseEntity(result.message, result.status)
    }

    @Operation(
        summary = "Download file from bucket that is currently in use",
        description = "Download file as application/octet-stream MIME type",
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "404", description = "Error: File not found in MinIO."),
            ApiResponse(responseCode = "200", description = "File successfully downloaded"),
            ApiResponse(responseCode = "500", description = "Error: File failed to download"),
            ApiResponse(responseCode = "400", description = "Error: An unexpected error occurred"),
        ],
    )
    @GetMapping("/files/{fileName}")
    fun downloadFile(@PathVariable fileName: String): ResponseEntity<StreamingResponseBody> {
        val result = minioService.downloadFile(fileName)
        val streamingResponseBody = StreamingResponseBody { outputStream ->
            outputStream.write(result.message)
        }
        return ResponseEntity
            .status(result.status)
            .header("Content-Disposition", "attachment; filename=\"$fileName\"")
            .header("Content-Type", "application/octet-stream")
            .body(streamingResponseBody)
    }

    @Operation(
        summary = "Delete file from bucket that is currently in use",
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "404", description = "File not found in bucket that is currently in use"),
            ApiResponse(responseCode = "200", description = "File successfully deleted."),
            ApiResponse(responseCode = "500", description = "Error: Unable to delete file"),
        ],
    )
    @DeleteMapping("/files/{filename}")
    fun deleteFile(@PathVariable filename: String): ResponseEntity<String> {
        val result = minioService.deleteFile(filename)
        return ResponseEntity(result.message, result.status)
    }

    @Operation(
        summary = "Try to upload all files from List of MultipartFile",
        description = "Returns Map<String, String> where 'key' is old file name, " +
            "'value' is hashed file name (which will be used for uploading) or error message for this file " +
            "also return summary status of all files",

    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "All files succesfully load"),
            ApiResponse(responseCode = "206", description = "Some files can`t be upload"),
            ApiResponse(responseCode = "400", description = "Not a single file has been uploaded"),
        ],
    )
    @PostMapping(
        path = ["/upload/local"],
        consumes = [MediaType.MULTIPART_FORM_DATA_VALUE],
    )
    fun uploadLocalFiles(@RequestParam("files") files: List<MultipartFile>): ResponseEntity<Map<String, String>> {
        val result = minioService.uploadLocalFiles(files)
        return ResponseEntity(result.message, result.status)
    }

    @Operation(
        summary = "Try to upload sended file",
        description = "Returns hashed file name (which will be used for uploading) or error message for this file",
    )
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "409", description = "File already exist in bucket that is currently in use"),
            ApiResponse(responseCode = "200", description = "File succesfully upload, return new fileName(hash code)"),
            ApiResponse(responseCode = "400", description = "Error in file upload"),
        ],
    )
    @PostMapping(
        path = ["/upload/remote"],
        consumes = [MediaType.MULTIPART_FORM_DATA_VALUE],
    )
    fun uploadRemoteFile(
        @RequestPart("file") file: MultipartFile,
        @RequestHeader("X-File-Name") fileName: String,
    ): ResponseEntity<String> {
        val result = minioService.uploadRemoteFile(file, fileName)
        return ResponseEntity(result.message, result.status)
    }
}
