# ─────────────────────────────────────────────
# Stage 1: Build the JAR with Maven
# ─────────────────────────────────────────────
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /app

# Copy Maven wrapper and pom first (cache dependency layer)
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

# Download dependencies (layer cached unless pom.xml changes)
RUN ./mvnw dependency:go-offline -B

# Copy source and build
COPY src ./src
RUN ./mvnw package -DskipTests -B

# ─────────────────────────────────────────────
# Stage 2: Minimal runtime image
# ─────────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copy the fat JAR from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Render sets PORT env var; default to 9090 to match prod config
ENV PORT=9090
EXPOSE 9090

# Activate the prod Spring profile so application-prod.properties is used
ENTRYPOINT ["java", \
  "-Dspring.profiles.active=prod", \
  "-Dserver.port=${PORT}", \
  "-jar", "app.jar"]
