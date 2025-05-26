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
  const conn = await waitForRabbit('amqp://rabbitmq');
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