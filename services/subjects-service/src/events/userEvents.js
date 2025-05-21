const amqp = require('amqplib');
const pgClient = require('../db/pgClient');

// Handlery eventów
async function handleUserDeleted(event) {
  const userId = event.payload.userId;
  const role = event.payload.role;
  // Usuń wszystkie przedmioty, gdzie user jest nauczycielem
  if (role === 'teacher') {
    await pgClient.query(
      `DELETE FROM subjects WHERE teacher_id = $1`,
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