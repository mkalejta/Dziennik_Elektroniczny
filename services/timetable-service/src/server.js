require('dotenv').config();
const express = require('express');
const timetableRoutes = require('./routes/timetableRoutes');
const connectMongo = require('./db/mongoClient');

const app = express();
app.use(express.json());

(async () => {
  const db = await connectMongo();
  app.locals.db = db;

  app.use('/api/timetable', timetableRoutes);

  const PORT = process.env.PORT_TIMETABLE_SERVICE || 8005;
  app.listen(PORT, () => {
    console.log(`Timetable service running on port ${PORT}`);
  });
})();