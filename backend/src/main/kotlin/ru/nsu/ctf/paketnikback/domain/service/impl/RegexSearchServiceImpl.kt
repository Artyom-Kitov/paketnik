package ru.nsu.ctf.paketnikback.domain.service.impl

import org.springframework.stereotype.Service
import ru.nsu.ctf.paketnikback.domain.dto.RegexSearchRequest
import ru.nsu.ctf.paketnikback.domain.dto.RegexSearchResponse
import ru.nsu.ctf.paketnikback.domain.service.PcapProcessorService
import ru.nsu.ctf.paketnikback.domain.service.RegexSearchService
import ru.nsu.ctf.paketnikback.exception.InvalidEntityException

@Service
class RegexSearchServiceImpl(
    private val pcapProcessorService: PcapProcessorService,
) : RegexSearchService {
    override fun search(request: RegexSearchRequest): RegexSearchResponse {
        val filename = request.filename

        val regex = try {
            Regex(request.regex)
        } catch (e: Exception) {
            throw InvalidEntityException("ERR: Invalid regex '${request.regex}': ${e.message}")
        }

        val matches = pcapProcessorService.searchByRegex(filename, regex)
        return RegexSearchResponse(matches)
    }
}
