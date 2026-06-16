# Stage 1: Build the Next.js 15 Frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps
COPY frontend/ ./
RUN npm run build

# Stage 2: Build the Spring Boot Backend
FROM maven:3.8.8-eclipse-temurin-17 AS backend-builder
WORKDIR /app
COPY pom.xml ./
RUN mvn dependency:go-offline || true
COPY src ./src
# Copy static frontend assets into Spring Boot's resource static directory
COPY --from=frontend-builder /app/frontend/out ./src/main/resources/static
RUN mvn clean package -DskipTests

# Stage 3: Lightweight Runtime Runner
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=backend-builder /app/target/event-booking-0.0.1-SNAPSHOT.jar app.jar
ENV PORT=8080
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
