package ru.nsu.ctf.paketnikback.controller.config

import io.minio.BucketExistsArgs
import io.minio.MakeBucketArgs
import io.minio.MinioClient
import io.minio.errors.MinioException
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import ru.nsu.ctf.paketnikback.utils.logger

@Configuration
class MinioConfig(
    @Value("\${minio.endpoint}") private val endpoint: String,
    @Value("\${minio.accessKey}") private val accessKey: String,
    @Value("\${minio.secretKey}") private val secretKey: String,
) {
    @Bean
    fun minioClient(): MinioClient {
        val log = logger()
        val client = MinioClient
            .builder()
            .endpoint(endpoint)
            .credentials(accessKey, secretKey)
            .build()

        val bucketName = "default-bucket"

        try {
            val found =
                client.bucketExists(
                    BucketExistsArgs.builder().bucket(bucketName).build(),
                )
            if (!found) {
                client.makeBucket(
                    MakeBucketArgs.builder().bucket(bucketName).build(),
                )
                log.info("Default bucket $bucketName успешно создан")
            } else {
                log.warn("Default bucket $bucketName уже существует")
            }
        } catch (e: MinioException) {
            log.error("Ошибка при создании default bucket: ${e.message}")
        }

        return client
    }
}
