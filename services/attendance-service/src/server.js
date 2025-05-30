require('dotenv').config();
const express = require('express');
const attendanceRoutes = require('./routes/attendanceRoutes');
const connectMongo = require('./db/mongoClient');
const checkJwt = require(`${process.env.NODE_PATH}/middleware/checkJwt`);
const { startEventListeners } = require('./events/userEvents');

const app = express();
app.use(express.json());

(async () => {
  const db = await connectMongo();
  app.locals.db = db;

  startEventListeners(db);

  app.use('/api/attendance', checkJwt, attendanceRoutes);
  app.get('/health', (req, res) => res.sendStatus(200));

  const PORT = process.env.PORT_ATTENDANCE_SERVICE || 8004;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Attendance service running on port ${PORT}`);
  });
})();
