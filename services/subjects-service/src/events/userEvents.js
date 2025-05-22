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

async function handleUserCreated(event) {
  const userId = event.payload.userId;
  const role = event.payload.role;
  // Dodaj przedmioty do bazy danych
  if (role === 'teacher') {
    const subject = event.payload.subject;
    await pgClient.query(
      `INSERT INTO subjects (id, name, teacher_id, class_id) VALUES ($1, $2, $3, $4)`,
      [subject.id, subject.name, userId, subject.classId]
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