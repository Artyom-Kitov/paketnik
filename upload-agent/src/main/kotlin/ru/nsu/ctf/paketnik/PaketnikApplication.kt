package ru.nsu.ctf.paketnik

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class PaketnikApplication

fun main(args: Array<String>) {
	runApplication<PaketnikApplication>(*args)
}
