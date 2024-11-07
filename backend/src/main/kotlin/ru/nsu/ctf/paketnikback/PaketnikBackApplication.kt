package ru.nsu.ctf.paketnikback

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.runApplication
import ru.nsu.ctf.paketnikback.app.config.AppConfig

@SpringBootApplication
@EnableConfigurationProperties(AppConfig::class)
class PaketnikBackApplication

fun main(args: Array<String>) {
    runApplication<PaketnikBackApplication>(*args)
}
