require('dotenv').config();
const express = require('express');
const gradeRoutes = require('./routes/gradeRoutes');
const connectMongo = require('./db/mongoClient');

const app = express();
app.use(express.json());

(async () => {
  const db = await connectMongo();
  app.locals.db = db;

  app.use('/api/grades', gradeRoutes);

  const PORT = process.env.PORT_GRADE_SERVICE || 8002;
  app.listen(PORT, () => {
    console.log(`Grade service running on port ${PORT}`);
  });
})();
