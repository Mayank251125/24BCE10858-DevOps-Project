# Stage 1: Build the Task Manager application using Maven Wrapper
FROM eclipse-temurin:17-jdk-jammy AS builder
WORKDIR /app

# Copy Maven Wrapper resources
COPY .mvn/ .mvn/
COPY mvnw mvnw.cmd pom.xml ./

# Strip carriage return characters from mvnw shell script (ensures compatibility if built on Windows)
RUN tr -d '\r' < mvnw > mvnw_unix && mv mvnw_unix mvnw && chmod +x mvnw

# Resolve and download Maven dependencies
RUN ./mvnw dependency:go-offline -B

# Copy Java source code and resources, and package the JAR file
COPY src ./src
RUN ./mvnw clean package -DskipTests -B

# Stage 2: Run the compiled Spring Boot jar inside JRE runtime
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copy the packaged jar from builder stage
COPY --from=builder /app/target/taskmanager-0.0.1-SNAPSHOT.jar app.jar

# Expose port 8081 (default Spring Boot port)
EXPOSE 8081

# Run the task manager servlet
ENTRYPOINT ["java", "-jar", "app.jar"]
