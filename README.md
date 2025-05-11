# Restart plikacji z plikami inicjalizacyjnymi
- docker volume rm mongo_data postgres_data
- docker-compose build
- docker-compose up -d

# Pobieranie realm-export.json (W PowerShell)
- docker exec -it keycloak /opt/keycloak/bin/kc.sh export --dir=/opt/keycloak/data/import --realm=gradebook --users=realm_file
- docker cp keycloak:/opt/keycloak/data/import/gradebook-realm.json ./realm-export.json