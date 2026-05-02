FROM maven:3.9.9-eclipse-temurin-11 AS build
WORKDIR /workspace
COPY pom.xml pom.xml
COPY gateway-service gateway-service
COPY auth-service auth-service
COPY meter-service meter-service
COPY analytics-service analytics-service
COPY alert-service alert-service
RUN mvn -pl alert-service -am clean package -DskipTests

FROM eclipse-temurin:11-jre
WORKDIR /app
COPY --from=build /workspace/alert-service/target/alert-service-1.0.0.jar app.jar
EXPOSE 8084
ENTRYPOINT ["java", "-jar", "app.jar"]
