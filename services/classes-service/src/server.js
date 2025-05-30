require('dotenv').config();
const express = require('express');
const classRoutes = require('./routes/classRoutes');
const connectMongo = require('./db/mongoClient');
const checkJwt = require(`${process.env.NODE_PATH}/middleware/checkJwt`);
const { startEventListeners } = require('./events/userEvents');

const app = express();
app.use(express.json());

(async () => {
  const db = await connectMongo();
  app.locals.db = db;

  startEventListeners();

  app.use('/api/classes', checkJwt, classRoutes);
  app.get('/health', (req, res) => res.sendStatus(200));

  const PORT = process.env.PORT_CLASS_SERVICE || 8007;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Class service running on port ${PORT}`);
  });
})();
