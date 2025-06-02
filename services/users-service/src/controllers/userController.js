const User = require('../models/User');
const pgClient = require('../db/pgClient');
const axios = require('axios');
const { getKeycloakAdminToken, createKeycloakUser, deleteUserFromKeycloak } = require('../utils/keycloak');
const { publishUserDeleted, publishUserCreated } = require('../events/eventPublisher');


async function getAllUsers(req, res) {
    try {
        const db = req.app.locals.db;
        const users = await db.collection('users').find({ role: { $ne: 'admin' } }).toArray();
        res.json(users.map(user => new User(user)));
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
}

async function createUser(req, res) {
    const { name, surname, email, username, role, classId, childId, subject } = req.body;

    if (!name || !surname || !username || !role) {
        return res.status(400).send('Missing required fields');
    }

    const db = req.app.locals.db;
    try {
        // Sprawdzenie czy użytkownik już istnieje w Mongo
        const existingUser = await db.collection('users').findOne({ _id: username });
        if (existingUser) {
            return res.status(409).send('User already exists');
        }

        // Tworzenie w Keycloak
        let temporaryPassword;
        try {
            temporaryPassword = await createKeycloakUser({ name, surname, email, username, role });
        } catch (err) {
            console.error('Error creating user in Keycloak:', err);
            return res.status(500).send('Failed to create user in Keycloak');
        }

        // Tworzenie w MongoDB
        try {
            await db.collection('users').insertOne({
                _id: username,
                name,
                surname,
                role,
            });
        } catch (err) {
            // Rollback w Keycloak
            await deleteUserFromKeycloak(username).catch(() => {});
            console.error('Error creating user in MongoDB:', err);
            return res.status(500).send('Failed to create user in database');
        }

        if (role === 'parent' && childId) {
            await db.collection('parent_child').insertOne({
                parentId: username,
                childId
            });
        }

        publishUserCreated({ _id: username, name, surname, role, classId }, subject);
        res.status(201).json({ message: 'User created successfully', temporaryPassword });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Internal server error');
    }
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

        const keycloakUrl = process.env.KEYCLOAK_INTERNAL_URL;
        const realm = process.env.KEYCLOAK_REALM;
        const adminToken = await getKeycloakAdminToken();

       const user = await db.collection('users').findOne({ _id: userId });

        // Usuń z Keycloak
        const kcUsers = await axios.get(
            `${keycloakUrl}/admin/realms/${realm}/users?username=${encodeURIComponent(userId)}`,
            { headers: { Authorization: `Bearer ${adminToken}` } }
        );

        if (kcUsers.data.length === 0) {
            return res.status(404).send('User not found in Keycloak');
        }

        const keycloakUserId = kcUsers.data[0].id;
        try {
            await axios.delete(
                `${keycloakUrl}/admin/realms/${realm}/users/${keycloakUserId}`,
                { headers: { Authorization: `Bearer ${adminToken}` } }
            );
        } catch (err) {
            console.error('Error deleting user from Keycloak:', err);
            return res.status(500).send('Failed to delete user from Keycloak');
        }

        // Usuń z MongoDB
        const result = await db.collection('users').deleteOne({ _id: userId });
        if (result.deletedCount === 0) {
            return res.status(404).send('User not found in database');
        }

        await publishUserDeleted(user);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting user:', error);
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

async function getPossibleMesageReceivers(req, res) {
    const userId = req.params.id;
    try {
        const db = req.app.locals.db;
        const user = await db.collection('users').findOne({ _id: userId });
        let users = [];

        if (user?.role === 'teacher') {
            users = await db.collection('users').find({ role: { $in: ['student', 'parent'] } }).toArray();
        } else if (['student', 'parent'].includes(user?.role)) {
            users = await db.collection('users').find({ role: 'teacher' }).toArray();
        }
        
        res.json(users.map(user => new User(user)));
    } catch (error) {
        console.error('Error fetching possible message receivers:', error);
        res.status(500).send('Internal server error');
    }
}

module.exports = {
    getAllUsers,
    createUser,
    getUser,
    deleteUser,
    getUserClass,
    getPossibleMesageReceivers
};
