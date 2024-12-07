package ru.nsu.ctf.paketnikback.controller

import io.minio.BucketExistsArgs
import io.minio.ListObjectsArgs
import io.minio.MakeBucketArgs
import io.minio.MinioClient
import io.minio.PutObjectArgs
import io.minio.StatObjectArgs
import io.minio.errors.MinioException
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RequestPart
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile
import ru.nsu.ctf.paketnikback.domain.service.PacketStreamService
import java.security.MessageDigest

@RestController
@RequestMapping("/minio-api")
class FileUploadController(
    private val minioClient: MinioClient,
    private val packetStreamService: PacketStreamService,
) {
    private var bucketName = "default-bucket"
    private var unknownNum = 1

    @PostMapping("/create-bucket")
    fun setBucketName(@RequestPart("New-Bucket-Name") name: String): ResponseEntity<String> {
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

    @PostMapping(
        path = ["/upload/local"],
        consumes = [MediaType.MULTIPART_FORM_DATA_VALUE],
    )
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
            return ResponseEntity("OK", HttpStatus.OK)
        } catch (e: MinioException) {
            return ResponseEntity("ERR: ${e.message}", HttpStatus.BAD_REQUEST)
        }
    }

    fun fileAlreadyExistInMinio(fileName: String): Boolean {
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

    fun loadFileToMinio(file: MultipartFile, fileName: String) {
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
        packetStreamService.createStreamsFromPcap(bucketName, fileName)
    }

    fun calculateFileHashStreaming(file: MultipartFile): String {
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

    fun getFileExtension(fileName: String): String = fileName.substringAfterLast(".", "")
}
