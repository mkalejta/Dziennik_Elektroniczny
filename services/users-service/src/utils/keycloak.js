const axios = require('axios');
const dotenv = require('dotenv');
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
        realmRoles: [role],
    };

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