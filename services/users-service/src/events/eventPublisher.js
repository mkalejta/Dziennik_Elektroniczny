const amqp = require('amqplib');

async function waitForRabbit(url, retries = 10, delay = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await amqp.connect(url);
    } catch (err) {
      if (i === retries - 1) throw err;
      console.log(`RabbitMQ not ready, retrying in ${delay / 1000}s...`);
      await new Promise(res => setTimeout(res, delay));
    }
  }
}

async function publishEvent(event) {
  const conn = await waitForRabbit('amqp://rabbitmq');
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