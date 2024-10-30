package ru.nsu.ctf.paketnikback.app_config

import jakarta.annotation.PostConstruct
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.bind.ConstructorBinding

@ConfigurationProperties("app")
data class AppConfig @ConstructorBinding constructor(
    val flagRegex: String?,
    val hostAddr: String?,
    val startTime: String?,
    val roundTicks: Int?
) {
    @PostConstruct
    fun validate() {
        // Проверка для FLAG_REGEX
        flagRegex?.let {
            
        }

        // Проверка для HOST_ADDR (в формате IPv4 или CIDR)
        hostAddr?.let {
            if (!it.matches(Regex("^([0-9]{1,3}\\.){3}[0-9]{1,3}(\\/\\d{1,2})?\$"))) {
                throw IllegalArgumentException("Невалидное значение опции HOST_ADDR: $it")
            }
        }

        // Проверка для START_TIME (HH:MM)
        startTime?.let {
            if (!it.matches(Regex("^([01]\\d|2[0-3]):([0-5]\\d)\$"))) {
                throw IllegalArgumentException("Невалидное значение опции START_TIME: $it")
            }
        }

        // Проверка для ROUND_TICKS
        roundTicks?.let {
            if (it < 0) {
                throw IllegalArgumentException("Невалидное значение опции ROUND_TICKS: $it")
            }
        }
    }
}
