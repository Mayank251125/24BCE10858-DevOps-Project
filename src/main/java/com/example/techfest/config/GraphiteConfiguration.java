package com.example.techfest.config;

import io.micrometer.core.instrument.Clock;
import io.micrometer.graphite.GraphiteConfig;
import io.micrometer.graphite.GraphiteMeterRegistry;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.micrometer.graphite.GraphiteProtocol;
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
            public GraphiteProtocol protocol() {
                // Use PLAINTEXT protocol for port 2003
                return GraphiteProtocol.PLAINTEXT;
            }

            @Override
            public Duration step() {
                // Metric export frequency (10 seconds)
                return Duration.ofSeconds(10);
            }

            @Override
            public boolean graphiteTagsEnabled() {
                // Disable tags so that metrics are exported as flat hierarchical paths
                return false;
            }

            @Override
            public boolean enabled() {
                // Enabled by default to push metrics to Graphite Carbon
                return true;
            }
        };
    }

    @Bean
    public GraphiteMeterRegistry graphiteMeterRegistry(GraphiteConfig config) {
        GraphiteMeterRegistry registry = new GraphiteMeterRegistry(config, Clock.SYSTEM);
        
        // Explicitly bind JVM and System metric binders to ensure they are registered
        new io.micrometer.core.instrument.binder.jvm.JvmMemoryMetrics().bindTo(registry);
        new io.micrometer.core.instrument.binder.jvm.JvmGcMetrics().bindTo(registry);
        new io.micrometer.core.instrument.binder.system.ProcessorMetrics().bindTo(registry);
        
        return registry;
    }
}
