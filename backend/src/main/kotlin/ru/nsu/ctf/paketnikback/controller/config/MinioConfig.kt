package ru.nsu.ctf.paketnikback.controller.config

import io.minio.MinioClient
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class MinioConfig {
    @Bean
    fun minioClient(): MinioClient {
        return MinioClient.builder()
            .endpoint("http://localhost:9000")
            .credentials("admin", "password")
            .build()
    }
}
