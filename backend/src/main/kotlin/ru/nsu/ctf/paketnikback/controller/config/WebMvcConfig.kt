package ru.nsu.ctf.paketnikback.app.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.UrlBasedCorsConfigurationSource
import org.springframework.web.filter.CorsFilter

@Configuration
class CorsConfig {
    @Bean
    fun corsFilter(): CorsFilter {
        val source = UrlBasedCorsConfigurationSource()
        val config = CorsConfiguration()
        
        // Allow all origins for development - restrict this in production
        config.allowCredentials = true
        config.addAllowedOrigin("http://localhost:8080")
        config.addAllowedHeader("*")
        config.addAllowedMethod("*")
        
        source.registerCorsConfiguration("/**", config)
        return CorsFilter(source)
    }
}
