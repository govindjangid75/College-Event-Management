# syntax=docker/dockerfile:1
# ==============================================================================
# Multi-Stage Production Dockerfile for CampusSphere Backend (Spring Boot 3 + Java 21)
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Build & Package with Maven
# ------------------------------------------------------------------------------
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder

WORKDIR /build

# Copy Maven Project Object Model first to leverage layer caching for dependencies
COPY pom.xml ./
RUN mvn dependency:go-offline -B

# Copy source code and compile production JAR
COPY src ./src
RUN mvn clean package -DskipTests -B

# ------------------------------------------------------------------------------
# Stage 2: Hardened, Minimal JRE 21 Runtime Container
# ------------------------------------------------------------------------------
FROM eclipse-temurin:21-jre-alpine AS runner

# Install wget/curl for health check probes
RUN apk add --no-cache curl tzdata

# Set timezone to Asia/Kolkata (Arya College, Jaipur)
ENV TZ=Asia/Kolkata

# Create non-root system group and user for container security hardening
RUN addgroup -S campussphere && adduser -S spring -G campussphere

WORKDIR /app

# Copy executable JAR artifact from builder stage
COPY --from=builder /build/target/campussphere-1.0.0.jar ./app.jar

# Enforce secure ownership
RUN chown -R spring:campussphere /app

# Switch to non-privileged user
USER spring:campussphere

# Standard Spring Boot application port
EXPOSE 8080

# Production-tuned container-aware JVM flags
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:+ExitOnOutOfMemoryError -Djava.security.egd=file:/dev/./urandom"

# Healthcheck probe verifying Actuator status
HEALTHCHECK --interval=30s --timeout=5s --start-period=45s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# Launch the Spring Boot microservice
ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar app.jar"]
