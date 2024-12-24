package ru.nsu.ctf.paketnikback.controller

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext
import org.springframework.http.HttpStatusCode
import org.springframework.test.context.DynamicPropertyRegistry
import org.springframework.test.context.DynamicPropertySource
import org.springframework.test.web.reactive.server.WebTestClient
import org.springframework.web.util.UriBuilder
import org.testcontainers.containers.MinIOContainer
import org.testcontainers.containers.MongoDBContainer
import ru.nsu.ctf.paketnikback.domain.dto.ContestServiceCreationRequest
import ru.nsu.ctf.paketnikback.domain.dto.ContestServiceResponse
import ru.nsu.ctf.paketnikback.domain.service.ContestServiceService
import java.net.URI
import java.util.*
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertTrue

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureWebTestClient
class ContestServiceControllerTest(
    @Autowired val webTestClient: WebTestClient,
) {
    private object TestConstants {
        private const val MAX_PORT_NUMBER = 0xFFFF
        val REQUEST_WITH_ZERO_PORT = ContestServiceCreationRequest("1", 0, "#ff0001")
        val REQUEST_WITH_BIGGER_THAN_MAX_PORT =
            ContestServiceCreationRequest("1", MAX_PORT_NUMBER + 1, "#ff0001")
        val REQUEST_WITH_EMPTY_NAME = ContestServiceCreationRequest("", 80, "#ff0000")
        val REQUEST_WITH_TOO_LONG_NAME =
            ContestServiceCreationRequest("a".repeat(228), 80, "#ff0000")
    }

    @Autowired
    private lateinit var service: ContestServiceService

    @Autowired
    private lateinit var webServerAppCtx: ServletWebServerApplicationContext

    companion object {
        private val mongoContainer = MongoDBContainer("mongo:4.4.2").apply { 
            this.start()
        }
        private val minioContainer =
            MinIOContainer("minio/minio:RELEASE.2023-09-04T19-57-37Z").apply {
                withUserName("admin")
                withPassword("123456789")
                start()
            }

        @JvmStatic
        @DynamicPropertySource
        fun setProperties(registry: DynamicPropertyRegistry) {
            registry.add("spring.data.mongodb.uri") {
                mongoContainer.getReplicaSetUrl("paketnik-db") 
            }

            registry.add("FLAG_REGEX") { "flag" }
            registry.add("MINIO_ENDPOINT") { minioContainer.s3URL }
            registry.add("MINIO_ACCESS_KEY") { minioContainer.userName }
            registry.add("MINIO_SECRET_KEY") { minioContainer.password }
        }
    }

    fun getRequestWithUniqueName(): ContestServiceCreationRequest {
        var randomName = UUID.randomUUID().toString()
        if (randomName.length > 64) {
            randomName = randomName.substring(0, 64)
        }

        return ContestServiceCreationRequest(randomName, 1, "#ff0000")
    }

    fun checkNoSuchContestService(req: ContestServiceCreationRequest) {
        assertFalse(
            this.service
                .getAll()
                .any {
                    it.name == req.name &&
                        it.port == req.port &&
                        it.hexColor == req.hexColor
                },
        )
    }

    @Test
    fun successfulCreationTest() {
        val servicesBefore = service.getAll()

        val responseResult =
            this.webTestClient
                .post()
                .uri("/services")
                .bodyValue(ContestServiceCreationRequest("1", 1, "#ff0000"))
                .exchange()
                .expectStatus()
                .is2xxSuccessful
                .expectBody(ContestServiceResponse::class.java)
                .returnResult()
                .responseBody as ContestServiceResponse

        assertTrue {
            responseResult.name == "1" &&
                responseResult.port == 1 &&
                responseResult.hexColor == "#ff0000"
        }

        val servicesAfter = service.getAll()

        assertTrue(servicesAfter.containsAll(servicesBefore))
        assertEquals(servicesBefore.size + 1, servicesAfter.size)
        assertTrue(servicesAfter.contains(responseResult))
    }

    @Test
    fun invalidCreation() {
        val before = this.service.getAll()

        val invalidRequests =
            listOf(
                TestConstants.REQUEST_WITH_ZERO_PORT,
                TestConstants.REQUEST_WITH_BIGGER_THAN_MAX_PORT,
                TestConstants.REQUEST_WITH_EMPTY_NAME,
                TestConstants.REQUEST_WITH_TOO_LONG_NAME,
            )

        for (invalidRequest in invalidRequests) {
            this.webTestClient
                .post()
                .uri("/services")
                .bodyValue(invalidRequest)
                .exchange()
                .expectStatus()
                .is4xxClientError
            assertEquals(before, this.service.getAll())
            checkNoSuchContestService(invalidRequest)
        }
    }

    @Test
    fun successfulUpdate() {
        val newServiceCreationReq = ContestServiceCreationRequest("abc", 80, "#ff0000")
        val newServiceId = this.service.create(newServiceCreationReq).id

        val updatedServiceReq = ContestServiceCreationRequest("abcd", 81, "#ff0001")

        this.webTestClient
            .put()
            .uri(
                fun(ub: UriBuilder): URI =
                    ub.path("/services").queryParam("id", newServiceId).build(),
            ).bodyValue(updatedServiceReq)
            .exchange()
            .expectStatus()
            .is2xxSuccessful()
            .expectBody(ContestServiceResponse::class.java)
            .isEqualTo(
                ContestServiceResponse(
                    newServiceId,
                    updatedServiceReq.name,
                    updatedServiceReq.port,
                    updatedServiceReq.hexColor,
                ),
            )

        val newUpdatedService = service.getAll().find { it.id == newServiceId }
        assertTrue(newUpdatedService is ContestServiceResponse)
        assertEquals(
            ContestServiceResponse(
                newServiceId,
                updatedServiceReq.name,
                updatedServiceReq.port,
                updatedServiceReq.hexColor,
            ),
            newUpdatedService,
        )
    }

    @Test
    fun invalidUpdate() {
        val newServiceCreationReq = ContestServiceCreationRequest("abc", 80, "#ff0000")
        val newServiceResponse = this.service.create(newServiceCreationReq)

        val invalidRequests =
            listOf(
                TestConstants.REQUEST_WITH_ZERO_PORT,
                TestConstants.REQUEST_WITH_BIGGER_THAN_MAX_PORT,
                TestConstants.REQUEST_WITH_EMPTY_NAME,
                TestConstants.REQUEST_WITH_TOO_LONG_NAME,
            )

        val servicesBefore = service.getAll()

        for (invalidRequest in invalidRequests) {
            this.webTestClient
                .put()
                .uri(
                    fun(ub: UriBuilder): URI =
                        ub
                            .path("/services")
                            .queryParam("id", newServiceResponse.id)
                            .build(),
                ).bodyValue(invalidRequest)
                .exchange()
                .expectStatus()
                .isEqualTo(HttpStatusCode.valueOf(400))
            assertEquals(servicesBefore, this.service.getAll())
            println("request: $invalidRequest, services: ${service.getAll()}")
            checkNoSuchContestService(invalidRequest)
        }

        val uniqueReq = this.getRequestWithUniqueName()

        // Invalid Id
        this.webTestClient
            .put()
            .uri(
                fun(ub: UriBuilder): URI =
                    ub
                        .path("/services")
                        .queryParam("id", "0".repeat(40))
                        .build(),
            ).bodyValue(uniqueReq)
            .exchange()
            .expectStatus()
            .isEqualTo(HttpStatusCode.valueOf(404))
        assertEquals(servicesBefore, this.service.getAll())
        checkNoSuchContestService(uniqueReq)
    }

    @Test
    fun successfulDelete() {
        val uniqueReq = this.getRequestWithUniqueName()
        val newUniqueServiceResponse = this.service.create(uniqueReq)
        val servicesBefore = service.getAll()
        webTestClient
            .delete()
            .uri(
                fun(ub: UriBuilder): URI =
                    ub
                        .path("/services")
                        .queryParam("id", newUniqueServiceResponse.id)
                        .build(),
            ).exchange()
            .expectStatus()
            .is2xxSuccessful()
        val servicesAfter = service.getAll()
        assertEquals(servicesBefore.size - 1, servicesAfter.size)
        for (serviceBefore in servicesBefore) {
            if (serviceBefore == newUniqueServiceResponse) {
                continue
            }
            assertTrue(servicesAfter.contains(serviceBefore))
        }

        checkNoSuchContestService(uniqueReq)
    }

    @Test
    fun invalidDelete() {
        val servicesBefore = service.getAll()
        webTestClient
            .delete()
            .uri(
                fun(ub: UriBuilder): URI =
                    ub.path("/services").queryParam("id", "some invalid id").build(),
            ).exchange()
            .expectStatus()
            .isEqualTo(HttpStatusCode.valueOf(404))
        val servicesAfter = service.getAll()
        assertEquals(servicesBefore, servicesAfter)
    }

    @Test
    fun getAllTest() {
        val servicesBefore = service.getAll()
        val servicesWasAdded: MutableList<ContestServiceResponse> = mutableListOf()
        for (i in 0..15) {
            val uniqueReq = this.getRequestWithUniqueName()
            servicesWasAdded.add(service.create(uniqueReq))

            val servicesGot =
                webTestClient
                    .get()
                    .uri("/services")
                    .exchange()
                    .expectStatus()
                    .is2xxSuccessful()
                    .expectBodyList(ContestServiceResponse::class.java)
                    .hasSize(servicesBefore.size + servicesWasAdded.size)
                    .returnResult()
                    .responseBody as
                    List<ContestServiceResponse>

            assertTrue(servicesGot.containsAll(servicesBefore))
            assertTrue(servicesGot.containsAll(servicesWasAdded))
        }
    }
}
