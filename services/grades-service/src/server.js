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
  app.get('/health', (req, res) => res.send('OK'));

  const PORT = process.env.PORT_GRADE_SERVICE || 8002;
  app.listen(PORT, () => {
    console.log(`Grade service running on port ${PORT}`);
  });
})();
