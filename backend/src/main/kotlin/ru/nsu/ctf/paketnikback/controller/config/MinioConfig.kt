package ru.nsu.ctf.paketnikback.controller.config

import io.minio.BucketExistsArgs
import io.minio.MakeBucketArgs
import io.minio.MinioClient
import io.minio.errors.MinioException
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class MinioConfig {
    @Bean
    fun minioClient(): MinioClient {
        val client = MinioClient
            .builder()
            .endpoint("http://localhost:9000")
            .credentials("admin", "password")
            .build()

        val bucketName = "default-bucket"

        try {
            val found = client.bucketExists(
                BucketExistsArgs
                    .builder()
                    .bucket(bucketName)
                    .build(),
            )
            if (!found) {
                client.makeBucket(
                    MakeBucketArgs
                        .builder()
                        .bucket(bucketName)
                        .build(),
                )
                println("Default bucket $bucketName успешно создан")
            } else {
                println("Default bucket $bucketName уже существует")
            }
        } catch (e: MinioException) {
            println("Ошибка при создании default bucket: ${e.message}")
        }

        return client
    }
}
