require('dotenv').config();
const express = require('express');
const gradeRoutes = require('./routes/gradeRoutes');
const connectMongo = require('./db/mongoClient');
const checkJwt = require(`${process.env.NODE_PATH}/middleware/checkJwt`);
const { startEventListeners } = require('./events/userEvents');

const app = express();
app.use(express.json());

(async () => {
  const db = await connectMongo();
  app.locals.db = db;

  startEventListeners();

  app.use('/api/grades', checkJwt, gradeRoutes);
  app.get('/health', (req, res) => res.sendStatus(200));

  const PORT = process.env.PORT_GRADE_SERVICE || 8002;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Grade service running on port ${PORT}`);
  });
})();
