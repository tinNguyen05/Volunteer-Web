package com.volunteerhub.configuration.controller;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class GlobalCorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Apply CORS policy to all endpoints
                .allowedOrigins(
                    "http://localhost:5173",  // Vite dev server
                    "http://localhost:3000",  // React default
                    "https://localhost:3000"  // HTTPS variant
                ) 
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH") // HTTP methods
                .allowedHeaders("*") // Allow all headers
                .exposedHeaders("Authorization") // Expose Authorization header
                .allowCredentials(true)
                .maxAge(3600); // Cache preflight for 1 hour
    }
}
