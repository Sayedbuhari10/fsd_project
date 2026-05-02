FROM maven:3.9.9-eclipse-temurin-11 AS build
WORKDIR /workspace
COPY pom.xml pom.xml
COPY auth-service auth-service
COPY gateway-service gateway-service
COPY dashboard-service dashboard-service
COPY consumption-service consumption-service
COPY simulation-service simulation-service
COPY realtime-service realtime-service
RUN mvn -pl realtime-service -am clean package -DskipTests

FROM eclipse-temurin:11-jre
WORKDIR /app
COPY --from=build /workspace/realtime-service/target/realtime-service-1.0.0.jar app.jar
EXPOSE 8085
ENTRYPOINT ["java", "-jar", "app.jar"]

