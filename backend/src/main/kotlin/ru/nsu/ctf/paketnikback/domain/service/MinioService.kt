package ru.nsu.ctf.paketnikback.domain.service

import org.springframework.web.multipart.MultipartFile
import ru.nsu.ctf.paketnikback.domain.dto.*

interface MinioService {
    fun createBucket(name: String): BucketCreationResult

    fun getUploadedFiles(): GetUploadedFilesResult

    fun downloadFile(fileName: String): DownloadFileResult

    fun deleteFile(filename: String): DeleteFileResult

    fun uploadLocalFiles(files: List<MultipartFile>): UploadLocalFilesResult

    fun uploadRemoteFile(file: InputStream, fileName: String, fileSize: Long): UploadRemoteFileResult
}
