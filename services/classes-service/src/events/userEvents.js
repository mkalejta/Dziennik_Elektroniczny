const amqp = require('amqplib');
const pgClient = require('../db/pgClient');

// Handlery eventów
async function handleUserDeleted(event) {
  if (event.payload.role === 'student') {
    const userId = event.payload.userId;
    await pgClient.query(
      `DELETE FROM students_classes WHERE student_id = $1`,
      [userId]
    );
  }
}

async function handleUserCreated(event) {
  if (event.payload.role === 'student') {
    const userId = event.payload.userId;
    const classId = event.payload.classId;
    await pgClient.query(
      `INSERT INTO students_classes (student_id, class_id) VALUES ($1, $2)`,
      [userId, classId]
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
    user_deleted: handleUserDeleted,
    user_created: handleUserCreated
  });
}

module.exports = {
  startEventListeners
};