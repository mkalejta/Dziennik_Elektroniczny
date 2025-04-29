require('dotenv').config();
const express = require('express');
const attendanceRoutes = require('./routes/attendanceRoutes');
const connectMongo = require('./db/mongoClient');

const app = express();
app.use(express.json());

(async () => {
  const db = await connectMongo();
  app.locals.db = db;

  app.use('/api/attendance', attendanceRoutes);

  const PORT = process.env.PORT_ATTENDANCE_SERVICE || 8004;
  app.listen(PORT, () => {
    console.log(`Attendance service running on port ${PORT}`);
  });
})();
