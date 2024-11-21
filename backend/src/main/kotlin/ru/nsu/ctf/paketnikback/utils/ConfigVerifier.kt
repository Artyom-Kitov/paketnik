package ru.nsu.ctf.paketnikback.utils

import org.springframework.stereotype.Component
import ru.nsu.ctf.paketnikback.app.config.AppConfig

@Component
class ConfigVerifier(
    private val appConfig: AppConfig,
) {
    fun getConfig(): AppConfig = appConfig

    fun printConfigValues() {
        println("FLAG_REGEX: ${appConfig.flagRegex}")
        println("HOST_ADDR: ${appConfig.hostAddr}")
        println("START_TIME: ${appConfig.startTime}")
        println("ROUND_TICKS: ${appConfig.roundTicks}")
    }
}
