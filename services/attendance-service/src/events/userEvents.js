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
  if (event.payload.role === 'student') {
    const studentId = event.payload.userId;
    await db.collection('attendance').updateMany(
      { "students.id": studentId },
      { $pull: { students: { id: studentId } } }
    );

    await db.collection('attendance').deleteMany({ students: { $size: 0 } });
  } else if (event.payload.role === 'teacher') {
    const teacherId = event.payload.userId;
    await db.collection('attendance').deleteMany({ teacherId });
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