const User = require('../models/User');
const pgClient = require('../db/pgClient');

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

async function addUserFromKeycloak(req, res) {
    const event = req.body;

    try {
        // Obsługa zdarzeń rejestracji użytkownika
        if (event.type === 'REGISTER') {
            const db = req.app.locals.db;

            // Dodaj użytkownika do MongoDB
            await db.collection('users').insertOne({
                _id: event.userId,
                name: event.details.firstName,
                surname: event.details.lastName,
                role: event.details.role,
            });
        }

        res.status(200).send('Event processed');
    } catch (error) {
        console.error('Error processing Keycloak event:', error);
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
    addUserFromKeycloak,
    getUser,
    deleteUser,
    getUserClass,
};
