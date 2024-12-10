package ru.nsu.ctf.paketnikback.domain.dto

import org.springframework.http.HttpStatus

data class BucketCreationResult(
    val message: String,
    val status: HttpStatus
)

data class GetUploadedFilesResult(
    val message: Map<String, List<String>>,
    val status: HttpStatus
)

data class DownloadFileResult(
    val message: ByteArray,
    val status: HttpStatus
)

data class DeleteFileResult(
    val message: String,
    val status: HttpStatus
)
data class UploadLocalFilesResult(
    val message: Map<String, String>,
    val status: HttpStatus
)

data class UploadRemoteFileResult(
    val message: String,
    val status: HttpStatus
)
