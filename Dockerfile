# Use Eclipse Temurin Java 25 JRE (smaller runtime image)
FROM eclipse-temurin:25-jre

# Set working directory
WORKDIR /app

# Copy the compiled JAR file from the host build directory
COPY target/techfest-0.0.1-SNAPSHOT.jar app.jar

# Expose the Spring Boot port
EXPOSE 8081

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]

