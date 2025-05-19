const amqp = require('amqplib');

// Handlery eventów
async function handleUserDeleted(event, db) {
  const userId = event.payload.userId;
  // Usuń wszystkie konwersacje, gdzie user jest uczestnikiem
  await db.collection('messages').deleteMany({
    $or: [
      { personId: userId },
      { teacherId: userId }
    ]
  });
}

// Generyczna funkcja nasłuchująca
async function listenForEvents(handlers, db) {
  const conn = await amqp.connect('amqp://rabbitmq');
  const ch = await conn.createChannel();
  await ch.assertExchange('events', 'fanout', { durable: false });
  const q = await ch.assertQueue('', { exclusive: true });
  ch.bindQueue(q.queue, 'events', '');
  ch.consume(q.queue, async msg => {
    const event = JSON.parse(msg.content.toString());
    if (handlers[event.type]) {
      try {
        await handlers[event.type](event, db);
      } catch (err) {
        console.error(`Error handling event ${event.type}:`, err);
      }
    }
  }, { noAck: true });
}

function startEventListeners(db) {
  listenForEvents({
    user_deleted: handleUserDeleted
  }, db);
}

module.exports = {
  startEventListeners
};