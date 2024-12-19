package ru.nsu.ctf.paketnikback.controller

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.http.HttpStatusCode
import org.springframework.test.context.DynamicPropertyRegistry
import org.springframework.test.context.DynamicPropertySource
import org.springframework.test.web.reactive.server.WebTestClient
import org.testcontainers.containers.MinIOContainer
import org.testcontainers.containers.MongoDBContainer
import ru.nsu.ctf.paketnikback.domain.dto.rule.RuleRequestDTO
import ru.nsu.ctf.paketnikback.domain.dto.rule.RuleResponseDTO
import ru.nsu.ctf.paketnikback.domain.entity.rule.RuleType
import ru.nsu.ctf.paketnikback.domain.entity.rule.ScopeType
import ru.nsu.ctf.paketnikback.domain.service.RuleService
import java.util.*
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertTrue

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureWebTestClient
class RulesControllerTest(
    @Autowired val webTestClient: WebTestClient,
) {
    private object TestConstants {
        val REQUEST_WITH_EMPTY_NAME = RuleRequestDTO("", RuleType.REGEX, "1", ScopeType.BOTH)
        val REQUEST_WITH_TOO_LONG_NAME =
            RuleRequestDTO("a".repeat(228), RuleType.REGEX, "1", ScopeType.BOTH)
        val REQUEST_WITH_TOO_LONG_REGEX =
            RuleRequestDTO("a", RuleType.REGEX, "a".repeat(228), ScopeType.BOTH)
        val REQUEST_WITH_EMPTY_REGEX = RuleRequestDTO("a", RuleType.REGEX, "", ScopeType.BOTH)
        val REQUEST_WITH_INVALID_REGEX =
            RuleRequestDTO("a", RuleType.REGEX, "\\\\(]", ScopeType.BOTH)
    }

    @Autowired private lateinit var service: RuleService

    @Autowired private lateinit var mongoTemplate: MongoTemplate

    @Autowired private lateinit var webServerAppCtx: ServletWebServerApplicationContext

    companion object {
        private val mongoContainer = MongoDBContainer("mongo:4.4.2").apply { this.start() }
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

    fun getUniqueRequest(): RuleRequestDTO {
        val randomName = UUID.randomUUID().toString()
        val randomRegex = UUID.randomUUID().toString()

        return RuleRequestDTO(
            randomName,
            RuleType.REGEX,
            randomRegex,
            ScopeType.BOTH,
        )
    }

    fun checkNoSuchRule(req: RuleRequestDTO) {
        assertFalse(
            this.service.getAllRules().any {
                it.name == req.name &&
                    it.type == req.type &&
                    it.regex == req.regex &&
                    it.scope == req.scope
            },
        )
    }

    @Test
    fun successfulCreationTest() {
        val rulesBefore = service.getAllRules()

        val randomName = UUID.randomUUID().toString()
        val randomRegex = UUID.randomUUID().toString()

        println("NAME:")
        println(randomName)

        val responseResult =
            this.webTestClient
                .post()
                .uri("/rules")
                .bodyValue(
                    RuleRequestDTO(
                        randomName,
                        RuleType.REGEX,
                        randomRegex,
                        ScopeType.BOTH,
                    ),
                ).exchange()
                .expectStatus()
                .is2xxSuccessful
                .expectBody(RuleResponseDTO::class.java)
                .returnResult()
                .responseBody as
                RuleResponseDTO

        assertTrue {
            responseResult.name == randomName &&
                responseResult.type == RuleType.REGEX &&
                responseResult.regex == randomRegex &&
                responseResult.scope == ScopeType.BOTH
        }

        val rulesAfter = service.getAllRules()

        assertTrue(rulesAfter.containsAll(rulesBefore))
        assertEquals(rulesBefore.size + 1, rulesAfter.size)
        assertTrue(rulesAfter.contains(responseResult))
    }

    @Test
    fun invalidCreation() {
        val before = this.service.getAllRules()

        val invalidRequests =
            listOf(
                TestConstants.REQUEST_WITH_EMPTY_REGEX,
                TestConstants.REQUEST_WITH_TOO_LONG_REGEX,
                TestConstants.REQUEST_WITH_EMPTY_NAME,
                TestConstants.REQUEST_WITH_TOO_LONG_NAME,
                TestConstants.REQUEST_WITH_INVALID_REGEX,
            )

        for (invalidRequest in invalidRequests) {
            this.webTestClient
                .post()
                .uri("/rules")
                .bodyValue(invalidRequest)
                .exchange()
                .expectStatus()
                .is4xxClientError
            assertEquals(before, this.service.getAllRules())
            checkNoSuchRule(invalidRequest)
        }
    }

    @Test
    fun successfulUpdate() {
        val randomName = UUID.randomUUID().toString()
        val randomRegex = UUID.randomUUID().toString()

        val newRuleCreationReq =
            RuleRequestDTO(
                randomName,
                RuleType.REGEX,
                randomRegex,
                ScopeType.BOTH,
            )

        val newRuleId = this.service.createRule(newRuleCreationReq).id

        val updateRuleReq =
            RuleRequestDTO(
                "randomName",
                RuleType.REGEX,
                "randomRegex",
                ScopeType.BOTH,
            )

        this.webTestClient
            .put()
            .uri("/rules/" + newRuleId)
            .bodyValue(updateRuleReq)
            .exchange()
            .expectStatus()
            .is2xxSuccessful()
            .expectBody(RuleResponseDTO::class.java)
            .isEqualTo(
                RuleResponseDTO(
                    newRuleId,
                    "randomName",
                    RuleType.REGEX,
                    "randomRegex",
                    ScopeType.BOTH,
                ),
            )

        val newUpdatedRule = service.getAllRules().find { it.id == newRuleId }
        assertTrue(newUpdatedRule is RuleResponseDTO)
        assertEquals(
            RuleResponseDTO(
                newRuleId,
                "randomName",
                RuleType.REGEX,
                "randomRegex",
                ScopeType.BOTH,
            ),
            newUpdatedRule,
        )
    }

    @Test
    fun invalidUpdate() {
        val randomName = UUID.randomUUID().toString()
        val randomRegex = UUID.randomUUID().toString()

        val newRuleCreationReq =
            RuleRequestDTO(
                randomName,
                RuleType.REGEX,
                randomRegex,
                ScopeType.BOTH,
            )
        val newRuleId = this.service.createRule(newRuleCreationReq).id

        val invalidRequests =
            listOf(
                TestConstants.REQUEST_WITH_EMPTY_REGEX,
                TestConstants.REQUEST_WITH_TOO_LONG_REGEX,
                TestConstants.REQUEST_WITH_EMPTY_NAME,
                TestConstants.REQUEST_WITH_TOO_LONG_NAME,
                TestConstants.REQUEST_WITH_INVALID_REGEX,
            )

        val rulesBefore = service.getAllRules()

        for (invalidRequest in invalidRequests) {
            this.webTestClient
                .put()
                .uri("/rules/" + newRuleId)
                .bodyValue(invalidRequest)
                .exchange()
                .expectStatus()
                .isEqualTo(HttpStatusCode.valueOf(400))
            assertEquals(rulesBefore, this.service.getAllRules())
            checkNoSuchRule(invalidRequest)
        }

        val uniqueReq = this.getUniqueRequest()

        // Invalid Id
        this.webTestClient
            .put()
            .uri("/rules/" + UUID.randomUUID().toString())
            .bodyValue(uniqueReq)
            .exchange()
            .expectStatus()
            .isEqualTo(HttpStatusCode.valueOf(404))
        assertEquals(rulesBefore, this.service.getAllRules())
        checkNoSuchRule(uniqueReq)
    }

    @Test
    fun successfulDelete() {
        val uniqueReq = this.getUniqueRequest()
        val newUniqueRuleResponse = this.service.createRule(uniqueReq)
        val rulesBefore = service.getAllRules()
        webTestClient
            .delete()
            .uri("/rules/" + newUniqueRuleResponse.id)
            .exchange()
            .expectStatus()
            .is2xxSuccessful()
        val rulesAfter = service.getAllRules()
        assertEquals(rulesBefore.size - 1, rulesAfter.size)
        for (ruleBefore in rulesBefore) {
            if (ruleBefore == newUniqueRuleResponse) {
                continue
            }
            assertTrue(rulesAfter.contains(ruleBefore))
        }

        checkNoSuchRule(uniqueReq)
    }

    @Test
    fun invalidDelete() {
        val rulesBefore = service.getAllRules()
        webTestClient
            .delete()
            .uri("/rules/some_id")
            .exchange()
            .expectStatus()
            .isEqualTo(HttpStatusCode.valueOf(404))
        val rulesAfter = service.getAllRules()
        assertEquals(rulesBefore, rulesAfter)
    }

    @Test
    fun getAllTest() {
        val rulesBefore = service.getAllRules()
        val rulesWasAdded: MutableList<RuleResponseDTO> = mutableListOf()
        for (i in 0..100) {
            val uniqueReq = this.getUniqueRequest()
            rulesWasAdded.add(service.createRule(uniqueReq))

            val rulesGot =
                webTestClient
                    .get()
                    .uri("/rules")
                    .exchange()
                    .expectStatus()
                    .is2xxSuccessful()
                    .expectBodyList(RuleResponseDTO::class.java)
                    .hasSize(rulesBefore.size + rulesWasAdded.size)
                    .returnResult()
                    .responseBody as
                    List<RuleResponseDTO>

            assertTrue(rulesGot.containsAll(rulesBefore))
            assertTrue(rulesGot.containsAll(rulesWasAdded))
        }
    }

    @Test
    fun dataStoredInMongo() {
        // val rulesBefore =
        val rulesId: MutableSet<String> = mutableSetOf()

        for (ruleInService in service.getAllRules()) {
            rulesId.add(ruleInService.id)
        }
        for (i in 0..10) {
            val uniqueReq = this.getUniqueRequest()
            rulesId.add(service.createRule(uniqueReq).id)
        }

        for (document in mongoTemplate.getCollection("rules").find()) {
            rulesId.remove(
                document.get("_id").toString(),
            )
        }

        assertTrue { rulesId.isEmpty() }
    }

    // TODO: Make marks tests, blocked by PAKETNIK-14252
}
