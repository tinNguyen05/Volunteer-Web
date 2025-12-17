package com.volunteerhub.configuration.graphql;

import graphql.analysis.MaxQueryDepthInstrumentation;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GraphQlConfig {

    @Bean
    public MaxQueryDepthInstrumentation maxQueryDepthInstrumentation() {
        // Ép cứng độ sâu tối đa là 20 (Thoải mái cho Facebook Wall)
        return new MaxQueryDepthInstrumentation(20); 
    }
}