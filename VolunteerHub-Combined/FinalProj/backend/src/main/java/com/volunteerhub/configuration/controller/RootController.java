package com.volunteerhub.configuration.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/")
public class RootController {

    @GetMapping
    public ResponseEntity<Map<String, Object>> getApiInfo() {
        Map<String, Object> info = new HashMap<>();
        info.put("application", "VolunteerHub API");
        info.put("version", "1.0.0");
        info.put("status", "running");
        
        Map<String, String> endpoints = new HashMap<>();
        endpoints.put("graphql", "http://localhost:8080/graphql");
        endpoints.put("graphiql", "http://localhost:8080/graphiql");
        endpoints.put("auth_signup", "POST http://localhost:8080/api/auth/signup");
        endpoints.put("auth_login", "POST http://localhost:8080/api/auth/login");
        endpoints.put("auth_refresh", "POST http://localhost:8080/api/auth/refresh");
        endpoints.put("user_profile", "POST/PUT http://localhost:8080/api/user-profile");
        
        info.put("endpoints", endpoints);
        info.put("documentation", "See BACKEND_FEATURES.md for full API documentation");
        
        return ResponseEntity.ok(info);
    }
}
