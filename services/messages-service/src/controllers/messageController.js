const Message = require('../models/Message');
const { ObjectId } = require('mongodb');

async function getAllMessages(req, res) {
    try {
        const db = req.app.locals.db;
        const messages = await db.collection('messages').find().toArray();
        res.json(messages);
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

async function getMessages(req, res) {
    try {
        const db = req.app.locals.db;
        const conversationId = req.params.conversationId;
        const conversation = await db.collection('messages').findOne({ _id: new ObjectId(conversationId) });

        if (!conversation) {
            return res.status(404).send('Conversation not found');
        }

        res.json(conversation);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
}

async function updateMessages(req, res) {
    try {
        const db = req.app.locals.db;
        const conversationId = req.params.conversationId;
        const message = req.body;

        if (!message || typeof message.author !== 'string' || typeof message.content !== 'string') {
            return res.status(400).send('Invalid message format');
        }

        message.sent = new Date();

        const conversation = await db.collection('messages').findOneAndUpdate(
            { _id: new ObjectId(conversationId) },
            { $push: { messages: message } },
            { returnDocument: 'after' }
        );

        console.log('Updated conversation:', conversation);
        

        if (!conversation.value) {
            return res.status(404).send('Conversation not found');
        }

        res.json(conversation.value);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
}

async function getMessagesByUserId(req, res) {
    try {
        const db = req.app.locals.db;
        const userId = req.params.userId;
        const messages = await db.collection('messages').find({ 'personId': userId }).toArray();

        console.log('Messages for user:', messages);

        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
}

async function getMessagesByTeacherId(req, res) {
    try {
        const db = req.app.locals.db;
        const teacherId = req.params.teacherId;
        const messages = await db.collection('messages').find({ 'teacherId': teacherId }).toArray();
        if (!messages) {
            return res.status(404).send('No messages found for this teacher');
        }
        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
}

module.exports = {
    getAllMessages,
    createMessage,
    getMessages,
    updateMessages,
    getMessagesByUserId,
    getMessagesByTeacherId
};