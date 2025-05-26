const pgClient = require('../db/pgClient');
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

async function handleUserDeleted(event) {
    if (event.payload.role === 'student') {
        const userId = event.payload.userId;
        // Usuń oceny tego ucznia
        await pgClient.query(
            `DELETE FROM grades WHERE student_id = $1`,
            [userId]
        );
    }
    if (event.payload.role === 'teacher') {
        const userId = event.payload.userId;
        // Usuń oceny wstawione przez tego nauczyciela
        await pgClient.query(
            `DELETE FROM grades WHERE teacher_id = $1`,
            [userId]
        );
    }
}

// Generyczna funkcja nasłuchująca
async function listenForEvents(handlers) {
  const conn = await waitForRabbit('amqp://rabbitmq');
  const ch = await conn.createChannel();
  await ch.assertExchange('events', 'fanout', { durable: false });
  const q = await ch.assertQueue('', { exclusive: true });
  ch.bindQueue(q.queue, 'events', '');
  ch.consume(q.queue, async msg => {
    const event = JSON.parse(msg.content.toString());
    if (handlers[event.type]) {
      try {
        await handlers[event.type](event);
      } catch (err) {
        console.error(`Error handling event ${event.type}:`, err);
      }
    }
  }, { noAck: true });
}

function startEventListeners() {
  listenForEvents({
    user_deleted: handleUserDeleted
  });
}

module.exports = {
  startEventListeners
};