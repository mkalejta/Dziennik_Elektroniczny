const amqp = require('amqplib');

async function publishEvent(event) {
    const conn = await amqp.connect('amqp://rabbitmq');
    const ch = await conn.createChannel();
    await ch.assertExchange('events', 'fanout', { durable: false });
    ch.publish('events', '', Buffer.from(JSON.stringify(event)));
    setTimeout(() => conn.close(), 500);
}

async function publishUserDeleted(user) {
    await publishEvent({
        type: 'user_deleted',
        payload: {
            userId: user._id,
            role: user.role
        }
    });
}

async function publishUserCreated(user, subject) {
    await publishEvent({
        type: 'user_created',
        payload: {
            userId: user._id,
            role: user.role,
            classId: user.classId,
            subject: subject
        }
    });
}

module.exports = {
    publishUserDeleted,
    publishUserCreated
};