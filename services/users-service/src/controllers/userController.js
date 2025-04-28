const User = require('../models/User');

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

module.exports = {
    getAllUsers,
    createUser,
};
