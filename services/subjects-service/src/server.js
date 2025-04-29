require('dotenv').config();
const express = require('express');
const subjectRoutes = require('./routes/subjectRoutes');
const connectMongo = require('./db/mongoClient');

const app = express();
app.use(express.json());

(async () => {
  const db = await connectMongo();
  app.locals.db = db;

  app.use('/api/subjects', subjectRoutes);

  const PORT = process.env.PORT_SUBJECTS_SERVICE || 8003;
  app.listen(PORT, () => {
    console.log(`Subjects service running on port ${PORT}`);
  });
})();
