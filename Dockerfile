# --- Estágio 1: Build da aplicação ---
FROM eclipse-temurin:17-jdk-jammy AS builder

WORKDIR /app

# Copia dependências do Maven
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x ./mvnw

# Baixa as dependências (camada cacheada)
RUN ./mvnw dependency:go-offline -B

# Copia o código-fonte e compila
COPY src ./src/
RUN ./mvnw clean package -DskipTests -B


# --- Estágio 2: Runtime leve ---
FROM eclipse-temurin:17-jdk-jammy

# Cria o usuário não-root primeiro por segurança
RUN useradd -r -s /bin/false -m appuser

WORKDIR /app

# Instala curl para o health check
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copia o JAR do estágio de build nomeado como 'builder' e ajusta o dono para /app
COPY --chown=appuser:appuser --from=builder /app/target/*.jar app.jar

# Altera para o usuário não-root
USER appuser

# Exposição de porta e health check
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# Otimizações de JVM para containers
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Djava.security.egd=file:/dev/./urandom"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]