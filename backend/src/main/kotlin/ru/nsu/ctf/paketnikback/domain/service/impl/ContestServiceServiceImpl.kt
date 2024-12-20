package ru.nsu.ctf.paketnikback.domain.service.impl

import org.springframework.stereotype.Service
import ru.nsu.ctf.paketnikback.domain.dto.ContestServiceCreationRequest
import ru.nsu.ctf.paketnikback.domain.dto.ContestServiceResponse
import ru.nsu.ctf.paketnikback.domain.mapper.ContestServiceMapper
import ru.nsu.ctf.paketnikback.domain.repository.ContestServiceRepository
import ru.nsu.ctf.paketnikback.domain.service.ContestServiceService
import ru.nsu.ctf.paketnikback.exception.EntityNotFoundException
import ru.nsu.ctf.paketnikback.utils.logger

@Service
class ContestServiceServiceImpl(
    private val contestServiceRepository: ContestServiceRepository,
    private val mapper: ContestServiceMapper,
) : ContestServiceService {
    private val log = logger()

    override fun create(request: ContestServiceCreationRequest): ContestServiceResponse {
        log.info("creating $request")
        
        val document = mapper.toDocument(request)
        val saved = contestServiceRepository.save(document)
        
        log.info("successfully created $saved")
        return mapper.toResponse(saved)
    }

    override fun getAll(): List<ContestServiceResponse> {
        log.info("getting all services")
        val services = contestServiceRepository.findAll()
        log.info("got ${services.size} services")
        return services.map(mapper::toResponse)
    }

    override fun update(id: String, request: ContestServiceCreationRequest): ContestServiceResponse {
        log.info("updating service with id = $id and request = $request")
        
        val document = contestServiceRepository
            .findById(id)
            .orElseThrow { EntityNotFoundException("service with id $id not found") }
        val newDocument = document.copy(
            name = request.name,
            port = request.port,
            hexColor = request.hexColor,
        )
        val saved = contestServiceRepository.save(newDocument)
        log.info("successfully updated service with id = $id, data = $saved")
        return mapper.toResponse(saved)
    }

    override fun deleteById(id: String) {
        log.info("deleting service with id $id")
        if (!contestServiceRepository.existsById(id)) {
            log.error("service with id $id does not exist")
            throw EntityNotFoundException("no service with id $id")
        }
        contestServiceRepository.deleteById(id)
        log.info("successfully deleted service with id = $id")
    }
}
