# ==========================================
# Stage 1: Build the Application
# ==========================================
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /app

# Copy the pom.xml and download dependencies first (caches them for faster future builds)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy the actual source code and build it
COPY src ./src
# We skip tests here because we will configure Jenkins to run tests before building!
RUN mvn clean package -DskipTests

# ==========================================
# Stage 2: Run the Application
# ==========================================
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy ONLY the compiled .jar file from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Spring Boot runs on 8080 by default internally
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]