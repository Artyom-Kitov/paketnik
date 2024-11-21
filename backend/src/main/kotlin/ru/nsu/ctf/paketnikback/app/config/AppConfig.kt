package ru.nsu.ctf.paketnikback.app.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.bind.ConstructorBinding
import java.time.LocalTime

@ConfigurationProperties("app")
class AppConfig @ConstructorBinding constructor(
    flagRegex: String,
    hostAddr: String,
    startTime: String,
    val roundTicks: Int
) {
    val flagRegex: Regex? = if (flagRegex.isNotEmpty()) Regex.fromLiteral(flagRegex) else null
    val hostAddr: String?
    val startTime: LocalTime

    init {
        require(hostAddr.isEmpty() || hostAddr.matches(Regex(HOST_ADDR_REGEX))) {
            "Невалидное значение опции HOST_ADDR: $hostAddr"
        }
        this.hostAddr = hostAddr.ifEmpty { null }
        require(startTime.isEmpty() || startTime.matches(Regex(START_TIME_REGEX))) {
            "Невалидное значение опции START_TIME: $startTime"
        }
        if (startTime.isEmpty()) {
            this.startTime = LocalTime.now()
        } else {
            val (hour, minute) = startTime.split(":").map { it.toInt() }
            this.startTime = LocalTime.of(hour, minute)
        }
        require(roundTicks >= 0) {
            "Невалидное значение опции ROUND_TICKS: $roundTicks"
        }
    }
    
    companion object {
        private const val HOST_ADDR_REGEX = "^([0-9]{1,3}\\.){3}[0-9]{1,3}(\\d{1,2})?\$"
        private const val START_TIME_REGEX = "^([01]\\d|2[0-3]):([0-5]\\d)\$"
    }
}
