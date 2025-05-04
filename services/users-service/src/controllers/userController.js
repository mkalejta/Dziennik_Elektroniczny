const User = require('../models/User');
const pgClient = require('../db/pgClient');

async function getAllUsers(req, res) {
    try {
        const db = req.app.locals.db;
        const users = await db.collection('users').find().project({ password: 0 }).toArray();
        res.json(users.map(user => new User(user)));
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
}

async function createUser(req, res) {
    try {
        const db = req.app.locals.db;
        const userData = req.body;

        User.validate(userData);
        const user = new User(userData);

        await db.collection('users').insertOne(user);
        res.status(201).json(user);
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
}

async function getSpecificUser(req, res) {
    try {
        const db = req.app.locals.db;
        const userId = req.params.id;
        const user = await db.collection('users').findOne({ _id: userId }, { projection: { password: 0 } });

        if (!user) {
            return res.status(404).send('User not found');
        }

        res.json(new User(user));
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
}

async function updateUser(req, res) {
    try {
        const db = req.app.locals.db;
        const userId = req.params.id;
        const userData = req.body;

        User.validate(userData);
        const user = new User(userData);

        const result = await db.collection('users').updateOne({ _id: userId }, { $set: user });

        if (result.matchedCount === 0) {
            return res.status(404).send('User not found');
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
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
        SELECT c.id AS class_id, c.name AS class_name
        FROM students_assignments sa
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
    getSpecificUser,
    updateUser,
    deleteUser,
    getUserClass
};
