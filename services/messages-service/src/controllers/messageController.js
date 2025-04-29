const Message = require('../models/Message');

async function getAllMessages(req, res) {
    try {
        const db = req.app.locals.db;
        const messages = await db.collection('messages').find().toArray();
        res.json(messages.map(message => new Message(message)));
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
}

async function createMessage(req, res) {
    try {
        const db = req.app.locals.db;
        const messageData = req.body;

        Message.validate(messageData);
        const message = new Message(messageData);

        await db.collection('messages').insertOne(message);
        res.status(201).json(message);
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
}

module.exports = {
    getAllMessages,
    createMessage,
};