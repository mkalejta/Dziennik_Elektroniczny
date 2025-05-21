require('dotenv').config();
const express = require('express');
const timetableRoutes = require('./routes/timetableRoutes');
const connectMongo = require('./db/mongoClient');
const checkJwt = require(`${process.env.NODE_PATH}/middleware/checkJwt`);
const { startEventListeners } = require('./events/userEvents');

const app = express();
app.use(express.json());

(async () => {
  const db = await connectMongo();
  app.locals.db = db;

  startEventListeners();

  app.use('/api/timetable', checkJwt, timetableRoutes);
  app.get('/health', (req, res) => res.send('OK'));

  const PORT = process.env.PORT_TIMETABLE_SERVICE || 8005;
  app.listen(PORT, () => {
    console.log(`Timetable service running on port ${PORT}`);
  });
})();