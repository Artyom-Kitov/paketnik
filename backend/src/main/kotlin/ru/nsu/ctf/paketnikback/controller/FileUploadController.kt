package ru.nsu.ctf.paketnikback.controller

import io.minio.MinioClient
import io.minio.errors.MinioException
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("/api/upload")
class FileUploadController(
    private val minioClient: MinioClient
) {

    @PostMapping
    fun uploadFiles(@RequestParam("files") files: List<MultipartFile>): ResponseEntity<Map<String, String>> {
        val uploadStatus = mutableMapOf<String, String>()

        files.forEach { file ->
            try {
                val bucketName = "traffic-dumps" // Название бакета MinIO
                if (!minioClient.bucketExists { it.bucket(bucketName) }) {
                    minioClient.makeBucket { it.bucket(bucketName) }
                }

                // Сохранение файла в MinIO
                minioClient.putObject {
                    it.bucket(bucketName)
                    it.`object`(file.originalFilename)
                    it.stream(file.inputStream, file.size, -1)
                    it.contentType(file.contentType)
                }

                uploadStatus[file.originalFilename ?: "unknown"] = "OK"
            } catch (e: MinioException) {
                uploadStatus[file.originalFilename ?: "unknown"] = "НЕ ОК: ${e.message}"
            }
        }

        return ResponseEntity.ok(uploadStatus)
    }
}
