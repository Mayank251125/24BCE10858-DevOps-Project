package com.example.taskmanager.config;

import io.micrometer.core.instrument.Clock;
import io.micrometer.graphite.GraphiteConfig;
import io.micrometer.graphite.GraphiteMeterRegistry;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

@Configuration
public class GraphiteConfiguration {

    @Bean
    public GraphiteConfig graphiteConfig() {
        return new GraphiteConfig() {
            @Override
            public String get(String key) {
                return null; // use defaults for undefined keys
            }

            @Override
            public String host() {
                // Read from environment variable or fall back to localhost
                String host = System.getenv("GRAPHITE_HOST");
                return (host != null) ? host : "localhost";
            }

            @Override
            public int port() {
                // Default carbon plain text port
                return 2003;
            }

            @Override
            public Duration step() {
                // Metric export frequency (10 seconds)
                return Duration.ofSeconds(10);
            }

            @Override
            public boolean enabled() {
                // Only push metrics if GRAPHITE_HOST env var is set (e.g., inside Docker/K8s)
                return System.getenv("GRAPHITE_HOST") != null;
            }
        };
    }

    @Bean
    public GraphiteMeterRegistry graphiteMeterRegistry(GraphiteConfig config) {
        // Register the Graphite reporter into Spring Boot's Micrometer global registry
        return new GraphiteMeterRegistry(config, Clock.SYSTEM);
    }
}
