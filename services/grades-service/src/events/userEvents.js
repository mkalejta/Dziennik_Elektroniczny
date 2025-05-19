const pgClient = require('../db/pgClient');
const amqp = require('amqplib');

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
  const conn = await amqp.connect('amqp://rabbitmq');
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