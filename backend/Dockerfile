FROM eclipse-temurin:17-jdk-alpine AS build

WORKDIR /app

COPY . .

RUN apk update && apk add --no-cache libpcap-dev

RUN chmod +x mvnw

RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:17-jdk-alpine

COPY --from=build /app/target/*.jar /app/app.jar

EXPOSE 8081

CMD ["java", "-jar", "/app/app.jar"]
