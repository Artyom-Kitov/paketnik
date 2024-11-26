package ru.nsu.ctf.paketnikback.exception.handler

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import ru.nsu.ctf.paketnikback.exception.EntityNotFoundException
import ru.nsu.ctf.paketnikback.exception.InternalServerErrorException
import ru.nsu.ctf.paketnikback.utils.logger

@ControllerAdvice
class ExceptionHandler {
    private val log = logger()

    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidationException(e: MethodArgumentNotValidException): ResponseEntity<String> {
        log.error("invalid request", e)
        return ResponseEntity.badRequest().body(e.message)
    }

    @ExceptionHandler(EntityNotFoundException::class)
    fun handleEntityNotFoundException(e: EntityNotFoundException): ResponseEntity<String> {
        log.error("entity not found", e)
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.message)
    }

    @ExceptionHandler(InternalServerErrorException::class)
    fun handleInternalServerErrorException(e: InternalServerErrorException): ResponseEntity<String> {
        log.error("internal server error", e)
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.message)
    }
}
