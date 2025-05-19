const amqp = require('amqplib');

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