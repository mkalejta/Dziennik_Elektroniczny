const axios = require('axios');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
dotenv.config();

function generateTemporaryPassword() {
    return Math.random().toString(36).slice(-8);
}

async function getKeycloakAdminToken() {
    const keycloakUrl = process.env.KEYCLOAK_INTERNAL_URL;
    const clientId = process.env.ADMIN_KEYCLOAK_CLIENT_ID;
    const clientSecret = process.env.ADMIN_KEYCLOAK_CLIENT_SECRET;
    const realm = process.env.KEYCLOAK_REALM;

    const response = await axios.post(
        `${keycloakUrl}/realms/${realm}/protocol/openid-connect/token`,
        new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: clientId,
            client_secret: clientSecret,
        }),
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }
    );

    return response.data.access_token;
}

async function createKeycloakUser({ name, surname, email, username, role }) {
    const keycloakUrl = process.env.KEYCLOAK_INTERNAL_URL;
    const realm = process.env.KEYCLOAK_REALM;
    const adminToken = await getKeycloakAdminToken();

    const temporaryPassword = generateTemporaryPassword();

    // 1. Utwórz użytkownika
    const userPayload = {
        username,
        email,
        firstName: name,
        lastName: surname,
        enabled: true,
        credentials: [
            {
                type: 'password',
                value: temporaryPassword,
                temporary: true,
            },
        ],
    };

    // Tworzenie użytkownika
    await axios.post(
        `${keycloakUrl}/admin/realms/${realm}/users`,
        userPayload,
        {
            headers: {
                Authorization: `Bearer ${adminToken}`,
                'Content-Type': 'application/json',
            },
        }
    );

    // 2. Pobierz ID użytkownika
    const kcUsers = await axios.get(
        `${keycloakUrl}/admin/realms/${realm}/users?username=${encodeURIComponent(username)}`,
        { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    if (!kcUsers.data.length) throw new Error('User not found after creation');
    const userId = kcUsers.data[0].id;

    // 3. Pobierz obiekt roli
    const rolesRes = await axios.get(
        `${keycloakUrl}/admin/realms/${realm}/roles/${role}`,
        { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    const roleObj = rolesRes.data;

    // 4. Przypisz rolę do użytkownika
    await axios.post(
        `${keycloakUrl}/admin/realms/${realm}/users/${userId}/role-mappings/realm`,
        [roleObj],
        { headers: { Authorization: `Bearer ${adminToken}` } }
    );

    // Zapisz utworzonego użytkownika do pliku CSV
    fs.appendFileSync(
        '/usr/src/app/csv/created-users.csv',
        `${username},${temporaryPassword}\n`
    );

    return temporaryPassword;
}

// Pomocnicza funkcja do rollbacku
async function deleteUserFromKeycloak(username) {
    const keycloakUrl = process.env.KEYCLOAK_INTERNAL_URL;
    const realm = process.env.KEYCLOAK_REALM;
    const adminToken = await getKeycloakAdminToken();
    const kcUsers = await axios.get(
        `${keycloakUrl}/admin/realms/${realm}/users?username=${encodeURIComponent(username)}`,
        { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    if (kcUsers.data.length > 0) {
        const keycloakUserId = kcUsers.data[0].id;
        await axios.delete(
            `${keycloakUrl}/admin/realms/${realm}/users/${keycloakUserId}`,
            { headers: { Authorization: `Bearer ${adminToken}` } }
        );
    }
}


module.exports = {
    getKeycloakAdminToken,
    createKeycloakUser,
    deleteUserFromKeycloak
};