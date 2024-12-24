package ru.nsu.ctf.paketnikback.exception.handler

import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.HttpStatusCode
import org.springframework.http.ResponseEntity
import org.springframework.validation.FieldError
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.context.request.WebRequest
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler
import ru.nsu.ctf.paketnikback.exception.EntityNotFoundException
import ru.nsu.ctf.paketnikback.exception.InvalidEntityException
import ru.nsu.ctf.paketnikback.utils.logger

@ControllerAdvice
class ClientExceptionHandler : ResponseEntityExceptionHandler() {
    private val log = logger()

    @ExceptionHandler(EntityNotFoundException::class)
    fun handleEntityNotFoundException(e: EntityNotFoundException): ResponseEntity<String> {
        log.error(e.message)
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.message)
    }

    @ExceptionHandler(InvalidEntityException::class)
    fun handleInvalidEntityException(e: InvalidEntityException): ResponseEntity<String> {
        log.error("invalid entity", e)
        return ResponseEntity.badRequest().body(e.message)
    }

    @ExceptionHandler(IllegalArgumentException::class)
    fun handleInvalidArgumentException(e: IllegalArgumentException): ResponseEntity<String> {
        log.error("invalid argument", e)
        return ResponseEntity.badRequest().body(e.message)
    }

    override fun handleMethodArgumentNotValid(
        ex: MethodArgumentNotValidException,
        headers: HttpHeaders,
        status: HttpStatusCode,
        request: WebRequest,
    ): ResponseEntity<Any>? {
        log.error(ex.message)
        val errors = ex.bindingResult.allErrors.map { error ->
            val fieldError = error as FieldError
            mapOf(
                "field" to fieldError.field,
                "message" to (fieldError.defaultMessage ?: "Invalid value"),
                "rejectedValue" to fieldError.rejectedValue,
            )
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
            mapOf(
                "error" to "Validation failed",
                "details" to errors,
            ),
        )
    }
}
