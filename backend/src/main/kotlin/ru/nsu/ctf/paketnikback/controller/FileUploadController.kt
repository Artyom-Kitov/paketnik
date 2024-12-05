package ru.nsu.ctf.paketnikback.controller

import io.minio.BucketExistsArgs
import io.minio.GetObjectArgs
import io.minio.ListObjectsArgs
import io.minio.MakeBucketArgs
import io.minio.MinioClient
import io.minio.PutObjectArgs
import io.minio.RemoveObjectArgs
import io.minio.StatObjectArgs
import io.minio.errors.MinioException
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody
import java.security.MessageDigest

@RestController
@RequestMapping("/minio-api")
class FileUploadController(
    private val minioClient: MinioClient,
) {
    private var bucketName = "default-bucket"
    private var unknownNum = 1

    @PostMapping("/create-bucket")
    fun setBucketName(@RequestParam("New-Bucket-Name") name: String): ResponseEntity<String> {
        bucketName = name
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
                return ResponseEntity("Bucket $name успешно создан", HttpStatus.OK)
            }
            return ResponseEntity("Bucket $name уже существует", HttpStatus.OK)
        } catch (e: MinioException) {
            return ResponseEntity(
                "Ошибка создания bucket: ${e.message}",
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
    }

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

    @GetMapping("/files/{fileName}")
    fun downloadFile(@PathVariable fileName: String): ResponseEntity<StreamingResponseBody> {
        println("$fileName, status ${fileAlreadyExistInMinio(fileName)}")
        if (!fileAlreadyExistInMinio(fileName)) {
            return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(StreamingResponseBody { it.write("Error: File not found.".toByteArray()) })
        }

        return try {
            val streamingResponseBody = StreamingResponseBody { outputStream ->
                minioClient
                    .getObject(
                        GetObjectArgs
                            .builder()
                            .bucket(bucketName)
                            .`object`(fileName)
                            .build(),
                    ).use { inputStream ->
                        inputStream.copyTo(outputStream)
                    }
            }

            val mimeType = "application/octet-stream"
            ResponseEntity
                .ok()
                .header("Content-Disposition", "attachment; filename=\"$fileName\"")
                .header("Content-Type", mimeType)
                .body(streamingResponseBody)
        } catch (e: MinioException) {
            ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(StreamingResponseBody { it.write("Error: File failed to download. ${e.message}".toByteArray()) })
        } catch (e: Exception) {
            ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(
                    StreamingResponseBody {
                        it.write(
                            "Error: An unexpected error occurred. ${e.message}".toByteArray(),
                        )
                    },
                )
        }
    }

    @DeleteMapping("/files/{filename}")
    fun deleteFile(@PathVariable filename: String): ResponseEntity<String> {
        val exists = fileAlreadyExistInMinio(filename)
        if (!exists) {
            return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body("Error: File $filename not found.")
        }
        return try {
            minioClient.removeObject(
                RemoveObjectArgs
                    .builder()
                    .bucket(bucketName)
                    .`object`(filename)
                    .build(),
            )
            ResponseEntity.ok("File $filename successfully deleted.")
        } catch (e: MinioException) {
            ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error: Unable to delete file. ${e.message}")
        }
    }

    @PostMapping("/upload/local")
    fun uploadLocalFiles(@RequestParam("files") files: List<MultipartFile>): ResponseEntity<Map<String, String>> {
        val uploadStatus = mutableMapOf<String, String>()

        files.forEach { file ->
            val originalFilename = file.originalFilename ?: "unknown_${unknownNum++}"

            val fileHash = calculateFileHashStreaming(file)
            val fileExtension = getFileExtension(originalFilename)
            val fileName = "$fileHash.$fileExtension"

            if (fileAlreadyExistInMinio(fileName)) {
                uploadStatus[fileName] = "ERR: File already exists in MinIO"
                return@forEach
            }

            try {
                loadFileToMinio(file, fileName)
                uploadStatus[fileName] = "OK"
            } catch (e: MinioException) {
                uploadStatus[fileName] = "ERR: ${e.message}"
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
        val fileHash = calculateFileHashStreaming(file)
        val fileExtension = getFileExtension(fileName)
        val hashFileName = "$fileHash.$fileExtension"

        if (fileAlreadyExistInMinio(hashFileName)) {
            return ResponseEntity("ERR: File already exists in MinIO", HttpStatus.BAD_REQUEST)
        }

        try {
            loadFileToMinio(file, hashFileName)
            return ResponseEntity("File succesfully upload", HttpStatus.OK)
        } catch (e: MinioException) {
            return ResponseEntity("ERR: ${e.message}", HttpStatus.BAD_REQUEST)
        }
    }

    private fun fileAlreadyExistInMinio(fileName: String): Boolean {
        try {
            minioClient.statObject(
                StatObjectArgs
                    .builder()
                    .bucket(bucketName)
                    .`object`(fileName)
                    .build(),
            )
            return true
        } catch (e: MinioException) {
            return false
        }
    }

    private fun loadFileToMinio(file: MultipartFile, fileName: String) {
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
        } catch (e: MinioException) {
            throw(e)
        }
    }

    private fun calculateFileHashStreaming(file: MultipartFile): String {
        val digest = MessageDigest.getInstance("SHA-256")

        file.inputStream.use { inputStream ->
            val buffer = ByteArray(8192)
            var bytesRead: Int
            while (inputStream.read(buffer).also { bytesRead = it } != -1) {
                digest.update(buffer, 0, bytesRead)
            }
        }
        return digest.digest().joinToString("") { "%02x".format(it) }
    }

    private fun getFileExtension(fileName: String): String = fileName.substringAfterLast(".", "")
}
