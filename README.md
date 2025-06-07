# 📝 Dziennik Elektroniczny

**Dziennik Elektroniczny** to aplikacja webowa stworzona w ramach przedmiotu _Bezpieczeństwo Aplikacji Webowych i Technologie Chmurowe_. Projekt oparty jest na architekturze mikroserwisów i wykorzystuje technologie takie jak Docker, Keycloak oraz bazy danych PostgreSQL i MongoDB.

---

## 🛠️ Technologie

![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white&style=for-the-badge)
![Express.js](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white&style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white&style=for-the-badge)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white&style=for-the-badge)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white&style=for-the-badge)
![Keycloak](https://img.shields.io/badge/Keycloak-0075A8?logo=keycloak&logoColor=white&style=for-the-badge)
![React](https://img.shields.io/badge/React-0075A8?logo=react&logoColor=white&style=for-the-badge)

---

## 📦 Techniczna specyfikacja

- **Architektura:** Mikroserwisy (Node.js/Express, React, Keycloak, MongoDB, PostgreSQL, Redis, RabbitMQ)
- **Zarządzanie kontenerami:** Docker, Docker Compose
- **Autoryzacja i uwierzytelnianie:** Keycloak
- **Bazy danych:** MongoDB, PostgreSQL
- **Komunikacja:** REST, RabbitMQ, Redis (cache)
- **Import realmu Keycloak:** Plik `realm-export.json` (pełna konfiguracja realmu, ról, klientów i użytkowników)
- **Obrazy Docker:** Wszystkie mikroserwisy mają własne, zoptymalizowane Dockerfile (multi-stage, .dockerignore). Obrazy są multiplatformowe (amd64, arm64) i dostępne na Docker Hub (`mkalejta/<nazwa-serwisu>:latest`).

### Główne serwisy

- **api-gateway** – brama API, proxy do mikroserwisów
- **users-service** – zarządzanie użytkownikami (MongoDB + Keycloak)
- **grades-service** – oceny (PostgreSQL)
- **subjects-service** – przedmioty (PostgreSQL)
- **attendance-service** – obecności (MongoDB/PostgreSQL)
- **timetable-service** – plan lekcji (PostgreSQL)
- **messages-service** – wiadomości (MongoDB/PostgreSQL)
- **classes-service** – klasy (PostgreSQL)
- **web-client** – klient React (uczeń/nauczyciel/rodzic)
- **admin-panel** – panel administracyjny (Express/EJS)
- **reports-client** – generowanie raportów (Node.js)

### Usługi wspólne

- **Keycloak** – zarządzanie użytkownikami i rolami
- **Redis** – cache/sesje
- **RabbitMQ** – komunikacja asynchroniczna
- **MongoDB, PostgreSQL** – bazy danych

---

## 🚀 Instrukcja uruchomienia

### 1. Wymagania

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Docker Compose](https://docs.docker.com/compose/)
- (dla Kubernetes) [kubectl](https://kubernetes.io/docs/tasks/tools/) oraz lokalny klaster (np. Docker Desktop z włączonym K8s lub Minikube)

---

### 2. Klonowanie repozytorium

```sh
git clone <adres_repozytorium>
cd DziennikElektroniczny
```

---

### 3. Pliki konfiguracyjne

- Plik `.env` jest już skonfigurowany.
- Plik `realm-export.json` zawiera użytkowników i konfigurację Keycloak.
- Plik `services/users-service/created-users.csv` zawiera loginy i tymczasowe hasła użytkowników do testów.
- **Plik `clients/reports-client/google/service-account.json` NIE jest w repozytorium.**  
  Poproś autora projektu o ten plik.

---

### 4. Pierwsze uruchomienie

1. **(Opcjonalnie) Usuń stare wolumeny danych:**
   ```sh
   docker volume rm mongo_data postgres_data keycloak_data keycloak_postgres_data reports_data
   ```

2. **Upewnij się, że masz plik `clients/reports-client/google/service-account.json` w odpowiedniej lokalizacji.**

3. **Pobierz obrazy i uruchom aplikację:**
   ```sh
   docker-compose pull
   docker-compose up -d
   ```

4. **Sprawdź status:**
   ```sh
   docker-compose ps
   ```

5. **Sprawdź logi (opcjonalnie):**
   ```sh
   docker-compose logs -f
   ```

6. **Dostęp do aplikacji:**
   - Web-client: [http://localhost:5173](http://localhost:5173)
     Login: `student1`, Hasło: `student1`
     Login: `parent1`, Hasło: `parent1`
     Login: `teacher1`, Hasło: `teacher1`
   - Admin-panel: [http://localhost:4000](http://localhost:4000)  
     Login: `admin1`, Hasło: `admin1`
   - Keycloak: [http://localhost:8080](http://localhost:8080)  
     Login: `admin`, Hasło: `admin`

---

## ▶️ Uruchomienie przez Kubernetes

1. **Upewnij się, że masz plik `clients/reports-client/google/service-account.json` w odpowiedniej lokalizacji.**

### Uwaga dotycząca pliku `created-users.csv` i wolumenu hostPath

Serwis `users-service` korzysta z pliku `services/users-service/created-users.csv`, który jest montowany do kontenera przez wolumen typu `hostPath`.  
Aby działało to poprawnie na Twoim komputerze, musisz **zmienić ścieżkę w pliku**  
`k8s/core/users-service-deployment.yaml`  
w sekcji:

```yaml
volumes:
  - name: users-csv
    hostPath:
      path: /run/desktop/mnt/host/c/Users/kalej/Uczelnia/DziennikElektroniczny/services/users-service/created-users.csv
      type: FileOrCreate
```

na **absolutną ścieżkę do pliku na Twoim systemie**.

> **Uwaga:**  
> Przykładowa ścieżka dla Docker Desktop na Windows/Mac:  
> `/run/desktop/mnt/host/c/Users/TWOJA_NAZWA/Uczelnia/DziennikElektroniczny/services/users-service/created-users.csv`  
> Przykładowa ścieżka dla Linuxa:  
> `/home/TWOJA_NAZWA/Uczelnia/DziennikElektroniczny/services/users-service/created-users.csv`

---

### Uwaga dotycząca autoskalowania (HPA)

Aby działało automatyczne skalowanie podów (HPA), Twój klaster Kubernetes musi mieć zainstalowany [metrics-server](https://github.com/kubernetes-sigs/metrics-server).

- **Minikube:**  
  Uruchom: `minikube addons enable metrics-server`

- **Docker Desktop:**  
  Zainstaluj metrics-server zgodnie z [oficjalną instrukcją](https://docs.docker.com/desktop/kubernetes/#installing-additional-tools).

Jeśli metrics-server nie jest dostępny, zasoby HPA nie będą działać poprawnie.

2. **Zresetuj i wdroż wszystkie zasoby (skrypt automatyczny):**
   ```sh
    chmod +x ./scripts/reset-k8s.sh
    ./scripts/reset-k8s.sh
   ```
   Skrypt:
   - Usuwa i tworzy namespace `dziennik`
   - Tworzy secreta z pliku `clients/reports-client/google/service-account.json` jako `reports-service-account` (plik YAML w `k8s/base/`)
   - Wdraża wszystkie zasoby (`kubectl apply -f ...`)
   - Ustawia port-forwarding do najważniejszych serwisów

3. **Dostęp do aplikacji:**
   - Web-client: [http://localhost:5173](http://localhost:5173)
   - Admin-panel: [http://localhost:4000](http://localhost:4000)
   - Keycloak: [http://localhost:8080](http://localhost:8080)

---

## ℹ️ Dodatkowe informacje

- Wszystkie serwisy komunikują się po nazwach kontenerów (dzięki sieci `gradebook-net`/namespace `dziennik`).
- Dane użytkowników i hasła testowe są dostępne w CSV.
- Po pierwszym uruchomieniu Keycloak automatycznie zaimportuje realm z pliku `realm-export.json`.
- Jeśli chcesz wyeksportować aktualny stan realmu Keycloak:
  ```sh
  docker exec -it <keycloak_container_name> /opt/keycloak/bin/kc.sh export --dir=/tmp --realm=gradebook --users=realm_file
  docker cp <keycloak_container_name>:/tmp/gradebook-realm.json ./realm-export.json
  ```

**Uwaga!**  
Plik `clients/reports-client/google/service-account.json` jest wymagany do działania serwisu `reports-client`, ale nie znajduje się w repozytorium ani w obrazie Dockera.  
**Trzeba posiadać ten plik lokalnie i zamontować go zgodnie z instrukcją powyżej.**
