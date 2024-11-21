package ru.nsu.ctf.paketnikback.controller

import io.minio.BucketExistsArgs
import io.minio.ListObjectsArgs
import io.minio.MakeBucketArgs
import io.minio.MinioClient
import io.minio.PutObjectArgs
import io.minio.StatObjectArgs
import io.minio.errors.ErrorResponseException
import io.minio.errors.MinioException
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("/minio-api")
class FileUploadController(
    private val minioClient: MinioClient,
) {
    private var bucketName = "traffic-dumps"
    private var unknownNum = 1

    @GetMapping("/get-files")
    fun getUploadedFiles(): ResponseEntity<Map<String, List<String>>> {
        val result = mutableMapOf<String, List<String>>()
        try {
            val buckets = minioClient.listBuckets()

            buckets.forEach { bucket ->
                val files = mutableListOf<String>()
                val objects = minioClient.listObjects(
                    ListObjectsArgs
                        .builder()
                        .bucket(bucket.name())
                        .build(),
                )

                objects.forEach { file ->
                    files.add(file.get().objectName())
                }
                result[bucket.name()] = files
            }
            return ResponseEntity(result, HttpStatus.OK)
        } catch (e: Exception) {
            return ResponseEntity(
                mapOf("error" to listOf("Error fetching files: ${e.message}")),
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
    }

    @PostMapping("/upload/local")
    fun uploadLocalFiles(@RequestParam("files") files: List<MultipartFile>): ResponseEntity<Map<String, String>> {
        val uploadStatus = mutableMapOf<String, String>()

        try {
            val found = minioClient.bucketExists(
                BucketExistsArgs
                    .builder()
                    .bucket(bucketName)
                    .build(),
            )
            if (!found) {
                minioClient.makeBucket(
                    MakeBucketArgs
                        .builder()
                        .bucket(bucketName)
                        .build(),
                )
            }
        } catch (e: MinioException) {
            return ResponseEntity(
                mapOf("error" to "Ошибка создания bucket: ${e.message}"),
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }

        files.forEach { file ->
            val filename = file.originalFilename ?: "unknown_${unknownNum++}"

            try {
                val stat = minioClient.statObject(
                    StatObjectArgs
                        .builder()
                        .bucket(bucketName)
                        .`object`(filename)
                        .build(),
                )

                uploadStatus[filename] = "ERR: File already exists in MinIO"
                return@forEach
            } catch (e: ErrorResponseException) {
                if (e.errorResponse().code() != "NoSuchKey") {
                    uploadStatus[filename] = "ERR: ${e.message}"
                    return@forEach
                }
            }

            try {
                file.inputStream.use { inputStream ->
                    minioClient.putObject(
                        PutObjectArgs
                            .builder()
                            .bucket(bucketName)
                            .`object`(filename)
                            .stream(inputStream, file.size, -1)
                            .contentType(file.contentType)
                            .build(),
                    )
                }
                uploadStatus[filename] = "OK"
            } catch (e: MinioException) {
                uploadStatus[filename] = "ERR: ${e.message}"
            }
        }

        val allSuccessful = uploadStatus.values.all { it == "OK" }
        val anySuccesfull = uploadStatus.values.any { it == "OK" }

        val status = when {
            allSuccessful -> HttpStatus.OK
            anySuccesfull -> HttpStatus.PARTIAL_CONTENT
            else -> HttpStatus.BAD_REQUEST
        }
        return ResponseEntity(uploadStatus, status)
    }

    @PostMapping("/upload/remote")
    fun uploadRemoteFile(
        @RequestPart("file") file: MultipartFile,
        @RequestHeader("X-File-Name") fileName: String,
    ): ResponseEntity<String> {
        try {
            val stat = minioClient.statObject(
                StatObjectArgs
                    .builder()
                    .bucket(bucketName)
                    .`object`(fileName)
                    .build(),
            )
            return ResponseEntity("ERR: File already exists in MinIO", HttpStatus.BAD_REQUEST)
        } catch (e: ErrorResponseException) {
            if (e.errorResponse().code() != "NoSuchKey") {
                return ResponseEntity("ERR: ${e.message}", HttpStatus.BAD_REQUEST)
            }
        }

        try {
            file.inputStream.use { inputStream ->
                minioClient.putObject(
                    PutObjectArgs
                        .builder()
                        .bucket(bucketName)
                        .`object`(fileName)
                        .stream(inputStream, file.size, -1)
                        .contentType(file.contentType)
                        .build(),
                )
            }
            return ResponseEntity("OK", HttpStatus.OK)
        } catch (e: MinioException) {
            return ResponseEntity("ERR: ${e.message}", HttpStatus.BAD_REQUEST)
        }
    }
}
