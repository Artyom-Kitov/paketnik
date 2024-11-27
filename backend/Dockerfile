FROM alpine:edge AS build

WORKDIR /app

COPY . .

RUN apk update && apk add --no-cache libpcap-dev openjdk17-jdk

RUN chmod +x mvnw

RUN ./mvnw clean package -DskipTests

FROM alpine:edge

RUN apk update && apk add --no-cache libpcap-dev openjdk17-jre

COPY --from=build /app/target/*.jar /app/app.jar

EXPOSE 8081

CMD ["java", "-jar", "/app/app.jar"]
