const axios = require('axios');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
dotenv.config();

const CSV_PATH = path.join(__dirname, '../services/users-service/created-users.csv');

async function getAdminToken() {
    const tokenRes = await axios.post(
        `${process.env.KEYCLOAK_PUBLIC_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
        new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: process.env.ADMIN_KEYCLOAK_CLIENT_ID,
            client_secret: process.env.ADMIN_KEYCLOAK_CLIENT_SECRET,
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    return tokenRes.data.access_token;
}

async function hasTemporaryPassword(username, token) {
    // Pobierz użytkownika po username
    const usersRes = await axios.get(
        `${process.env.KEYCLOAK_PUBLIC_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users?username=${encodeURIComponent(username)}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!usersRes.data.length) return false;
    const user = usersRes.data[0];

    // Sprawdź, czy requiredActions zawiera "UPDATE_PASSWORD"
    return Array.isArray(user.requiredActions) && user.requiredActions.includes("UPDATE_PASSWORD");
}

async function main() {
    const lines = fs.readFileSync(CSV_PATH, 'utf-8').split('\n').filter(Boolean);
    const token = await getAdminToken();

    const toKeep = [];
    for (const line of lines) {
        const [username, password] = line.split(',');
        process.stdout.write(`Sprawdzam ${username}... `);
        try {
            const isTemp = await hasTemporaryPassword(username, token);
            if (isTemp) {
                toKeep.push(line);
                console.log('tymczasowe hasło AKTUALNE');
            } else {
                console.log('hasło ZMIENIONE – usuwam z pliku');
            }
        } catch (err) {
            console.log('błąd:', err.response?.data?.errorMessage || err.message);
            // W razie błędu zachowaj linię, by nie stracić danych
            toKeep.push(line);
        }
    }

    fs.writeFileSync(CSV_PATH, toKeep.join('\n') + '\n', 'utf-8');
    console.log('\nAktualizacja pliku zakończona.');
}

main();