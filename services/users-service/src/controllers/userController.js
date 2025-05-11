const User = require('../models/User');
const pgClient = require('../db/pgClient');
const axios = require('axios');

function generateTemporaryPassword() {
    return Math.random().toString(36).slice(-8);
}

async function getKeycloakAdminToken() {
    const keycloakUrl = process.env.KEYCLOAK_INTERNAL_URL;
    const clientId = process.env.KEYCLOAK_CLIENT_ID;
    const clientSecret = process.env.KEYCLOAK_CLIENT_SECRET;
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


async function getAllUsers(req, res) {
    try {
        const db = req.app.locals.db;
        const users = await db.collection('users').find().toArray();
        res.json(users.map(user => new User(user)));
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
}

async function createUser(req, res) {
    const { name, surname, username, role } = req.body;

    try {

        const temporaryPassword = await createKeycloakUser({ name, surname, email, username, role });

        const db = req.app.locals.db;
        const existingUser = await db.collection('users').findOne({ _id: username });

        if (existingUser) {
            return res.status(409).send('User already exists');
        }

        if (!name || !surname || !username || !role) {
            return res.status(400).send('Missing required fields');
        }

        await db.collection('users').insertOne({
            _id: username,
            name,
            surname,
            role,
        });

        res.status(201).json({ message: 'User created successfully', temporaryPassword });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Internal server error');
    }
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

async function getUser(req, res) {
    const userId = req.params.id;

    try {
        const db = req.app.locals.db;
        const user = await db.collection('users').findOne({ _id: userId });

        if (!user) {
            return res.status(404).send('User not found');
        }

        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).send('Internal server error');
    }
}

async function deleteUser(req, res) {
    try {
        const db = req.app.locals.db;
        const userId = req.params.id;

        const result = await db.collection('users').deleteOne({ _id: userId });

        if (result.deletedCount === 0) {
            return res.status(404).send('User not found');
        }

        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
}

async function getUserClass(req, res) {
    const userId = req.params.id;

    try {
        const result = await pgClient.query(
            `
        SELECT c.id AS class_id
        FROM students_classes sa
        JOIN class c ON sa.class_id = c.id
        WHERE sa.student_id = $1
        `,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Class not found for this student' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching student class:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getAllUsers,
    createUser,
    getUser,
    deleteUser,
    getUserClass,
};
