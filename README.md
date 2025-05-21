# 📝 Dziennik Elektroniczny

**Dziennik Elektroniczny** to aplikacja webowa stworzona w ramach przedmiotu _Bezpieczeństwo Aplikacji Webowych i Technologie Chmurowe_. Projekt oparty jest na architekturze mikroserwisów i wykorzystuje technologie takie jak Docker, Keycloak oraz bazy danych PostgreSQL i MongoDB.

## 🛠️ Technologie

![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white&style=for-the-badge)
![Express.js](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white&style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white&style=for-the-badge)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white&style=for-the-badge)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white&style=for-the-badge)
![Keycloak](https://img.shields.io/badge/Keycloak-0075A8?logo=keycloak&logoColor=white&style=for-the-badge)
![React](https://img.shields.io/badge/React-0075A8?logo=react&logoColor=white&style=for-the-badge)

## ▶️ Uruchomienie lokalne

### 🔧 Wymagania

- Docker
- Docker Compose

### 📥 Instalacja i uruchomienie

1. **Usuń istniejące wolumeny danych (opcjonalnie):**

    ```bash
    docker volume rm mongo_data postgres_data
    ```
   
2. **Zbuduj obrazy i uruchom kontenery:**

    ```bash
    docker-compose build
    docker-compose up -d
    ```



# Pobieranie realm-export.json (W PowerShell)
- docker exec -it keycloak /opt/keycloak/bin/kc.sh export --dir=/tmp --realm=gradebook --users=realm_file
- docker cp keycloak:/tmp/gradebook-realm.json ./realm-export.json
