package ru.nsu.ctf.paketnikback.domain.service.impl

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
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import ru.nsu.ctf.paketnikback.domain.dto.*
import ru.nsu.ctf.paketnikback.domain.service.MinioService
import ru.nsu.ctf.paketnikback.domain.service.PacketStreamService
import ru.nsu.ctf.paketnikback.exception.InvalidEntityException
import ru.nsu.ctf.paketnikback.utils.logger
import java.security.MessageDigest
import java.util.UUID

@Service
class MinioServiceImpl(
    private val minioClient: MinioClient,
    private val packetStreamService: PacketStreamService,
) : MinioService {
    private var bucketName = "default-bucket"
    private val log = logger()

    override fun createBucket(name: String): BucketCreationResult {
        log.info("Attempting to create bucket: $name")

        bucketName = name
        return try {
            val found = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build())
            if (!found) {
                log.info("Bucket $name does not exist. Proceeding with creation.")

                minioClient.makeBucket(
                    MakeBucketArgs
                        .builder()
                        .bucket(bucketName)
                        .build(),
                )
                log.info("Bucket $name successfully created")
                BucketCreationResult("Bucket $name успешно создан", HttpStatus.OK)
            } else {
                log.info("Bucket $name already exists.")
                BucketCreationResult("Bucket $name уже существует", HttpStatus.OK)
            }
        } catch (e: MinioException) {
            log.error("Error: creating bucket $name: ${e.message}", e)
            BucketCreationResult("Ошибка создания bucket: ${e.message}", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    override fun getUploadedFiles(): GetUploadedFilesResult {
        log.info("Attempting to get all file names")

        val result = mutableMapOf<String, List<String>>()
        try {
            val buckets = minioClient.listBuckets()

            buckets.forEach { bucket ->
                val files = minioClient
                    .listObjects(
                        ListObjectsArgs.builder().bucket(bucket.name()).build(),
                    ).map { it.get().objectName() }

                result[bucket.name()] = files
            }
            log.info("File names successfully received")

            return GetUploadedFilesResult(result, HttpStatus.OK)
        } catch (e: Exception) {
            log.error("Error: receiving file names: ${e.message}", e)
            return GetUploadedFilesResult(
                mapOf("error" to listOf("Error receiving files: ${e.message}")),
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
    }

    override fun downloadFile(fileName: String): DownloadFileResult {
        log.info("Attempting download file $fileName")

        if (!fileAlreadyExistInMinio(fileName)) {
            log.error("Error: File $fileName not found in MinIO.")
            return DownloadFileResult(
                message = "Error: File not found.".toByteArray(),
                status = HttpStatus.NOT_FOUND,
            )
        }

        return try {
            log.info("File $fileName found. Starting download process.")

            val bytes = minioClient
                .getObject(
                    GetObjectArgs
                        .builder()
                        .bucket(bucketName)
                        .`object`(fileName)
                        .build(),
                ).use { inputStream ->
                    inputStream.readAllBytes()
                }

            log.info("File $fileName successfully downloaded.")
            DownloadFileResult(bytes, HttpStatus.OK)
        } catch (e: MinioException) {
            log.error("Error: downloading file $fileName from MinIO: ${e.message}", e)
            DownloadFileResult(
                message = "Error: File failed to download. ${e.message}".toByteArray(),
                status = HttpStatus.INTERNAL_SERVER_ERROR,
            )
        } catch (e: Exception) {
            log.error("Unexpected error downloading file $fileName: ${e.message}", e)
            DownloadFileResult(
                message = "Error: An unexpected error occurred. ${e.message}".toByteArray(),
                status = HttpStatus.BAD_REQUEST,
            )
        }
    }

    override fun deleteFile(fileName: String): DeleteFileResult {
        log.info("Attempting delete file $fileName")
        val exists = fileAlreadyExistInMinio(fileName)
        if (!exists) {
            log.error("Error: File $fileName not found in MinIO.")
            return DeleteFileResult("Error: File $fileName not found.", HttpStatus.NOT_FOUND)
        }
        return try {
            minioClient.removeObject(
                RemoveObjectArgs
                    .builder()
                    .bucket(bucketName)
                    .`object`(fileName)
                    .build(),
            )
            log.info("File $fileName successfully deleted.")
            DeleteFileResult("File $fileName successfully deleted.", HttpStatus.OK)
        } catch (e: MinioException) {
            log.error("Error: Unable to delete file. ${e.message}", e)
            DeleteFileResult("Error: Unable to delete file. ${e.message}", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    override fun uploadLocalFiles(files: List<MultipartFile>): UploadLocalFilesResult {
        log.info("Attempting upload local files")

        val uploadStatus = mutableMapOf<String, String>()

        files.forEach { file ->
            val fileName = file.originalFilename ?: "unknown_${UUID.randomUUID()}"
            
            if (file.getSize() == 0L) {
                log.error("Error: file $fileName is empty")
                uploadStatus[fileName] = "ERR: File is empty"
                return@forEach
            }

            val fileHash = calculateFileHashStreaming(file)
            val fileExtension = getFileExtension(fileName)
            val hashFileName = "$fileHash.$fileExtension"

            if (fileAlreadyExistInMinio(hashFileName)) {
                log.error("Error: file $fileName already exist in MinIO")
                uploadStatus[fileName] = "ERR: File already exists in MinIO"
                return@forEach
            }

            try {
                loadFileToMinio(file, hashFileName)
                log.info("File $fileName successfully load, hash name is $hashFileName")
                uploadStatus[fileName] = "OK_status, hash name is $hashFileName"
            } catch (e: MinioException) {
                log.error("Error: unable to load file $fileName: ${e.message}", e)
                uploadStatus[fileName] = "ERR: ${e.message}"
            }
        }

        val allSuccessful = uploadStatus.values.all { it.contains("OK_status") }
        val anySuccessful = uploadStatus.values.any { it.contains("OK_status") }

        val status = when {
            allSuccessful -> HttpStatus.OK
            anySuccessful -> HttpStatus.PARTIAL_CONTENT
            else -> HttpStatus.BAD_REQUEST
        }

        log.info(
            "Complete uploading. Successful: {}, Failed: {}",
            uploadStatus.values.count { it.contains("OK_status") },
            uploadStatus.values.count { it.startsWith("ERR") },
        )
        return UploadLocalFilesResult(uploadStatus, status)
    }

    override fun uploadRemoteFile(file: ByteArray, fileName: String, fileSize: Long): UploadRemoteFileResult {
        log.info("Attempting upload remote files")
        val safeFileName = fileName ?: "unknown_${UUID.randomUUID()}"
        val fileHash = calculateFileAsBytesHash(file)
        val fileExtension = getFileExtension(safeFileName)
        val hashFileName = "$fileHash.$fileExtension"

        if (fileAlreadyExistInMinio(hashFileName)) {
            log.error("ERR: File $safeFileName already exists in MinIO")
            return UploadRemoteFileResult("ERR: File already exists in MinIO", HttpStatus.CONFLICT)
        }

        try {
            loadFileAsBytesToMinio(file, hashFileName, fileSize)
            log.info("File $safeFileName successfully upload, hash name is $hashFileName")
            return UploadRemoteFileResult("File successfully upload, hash name is $hashFileName", HttpStatus.OK)
        } catch (e: MinioException) {
            log.error("Error: upload remote file $safeFileName: ${e.message}", e)
            return UploadRemoteFileResult("ERR: ${e.message}", HttpStatus.BAD_REQUEST)
        }
    }

    private fun fileAlreadyExistInMinio(fileName: String): Boolean {
        try {
            minioClient
                .statObject(
                    StatObjectArgs
                        .builder()
                        .bucket(bucketName)
                        .`object`(fileName)
                        .build(),
                ).let { log.info(it.toString()) }
            return true
        } catch (e: MinioException) {
            return false
        }
    }

    private fun loadFileToMinio(file: MultipartFile, fileName: String) {
        file.inputStream.use { inputStream ->
            minioClient.putObject(
                PutObjectArgs
                    .builder()
                    .bucket(bucketName)
                    .`object`(fileName)
                    .stream(inputStream, file.size, -1)
                    .build(),
            )
        }
        packetStreamService.createStreamsFromPcap(bucketName, fileName)
    }

    private fun loadFileAsBytesToMinio(file: ByteArray, fileName: String, fileSize: Long) {
        file.inputStream().use { inputStream ->
            minioClient.putObject(
                PutObjectArgs
                    .builder()
                    .bucket(bucketName)
                    .`object`(fileName)
                    .stream(inputStream, file.size.toLong(), -1)
                    .build(),
            )
        }
        packetStreamService.createStreamsFromPcap(bucketName, fileName)
    }

    private fun calculateFileAsBytesHash(file: ByteArray): String {
        val digest = MessageDigest.getInstance("SHA-256")

        file.inputStream().use { inputStream ->
            val buffer = ByteArray(8192)
            var bytesRead: Int
            while (inputStream.read(buffer).also { bytesRead = it } != -1) {
                digest.update(buffer, 0, bytesRead)
            }
        }
        return digest.digest().joinToString("") { "%02x".format(it) }
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
