package ru.nsu.ctf.paketnikback.app.config

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
        flagRegex?.let {
            
        }

        hostAddr?.let {
            if (!it.matches(Regex("^([0-9]{1,3}\\.){3}[0-9]{1,3}(\\d{1,2})?\$"))) {
                throw IllegalArgumentException("Невалидное значение опции HOST_ADDR: $it")
            }
        }

        startTime?.let {
            if (!it.matches(Regex("^([01]\\d|2[0-3]):([0-5]\\d)\$"))) {
                throw IllegalArgumentException("Невалидное значение опции START_TIME: $it")
            }
        }

        roundTicks?.let {
            if (it < 0) {
                throw IllegalArgumentException("Невалидное значение опции ROUND_TICKS: $it")
            }
        }
    }
}
