require('dotenv').config();
const express = require('express');
const messageRoutes = require('./routes/messageRoutes');
const connectMongo = require('./db/mongoClient');
const checkJwt = require(`${process.env.NODE_PATH}/middleware/checkJwt`);

const app = express();
app.use(express.json());

(async () => {
  const db = await connectMongo();
  app.locals.db = db;

  app.use('/api/messages', checkJwt, messageRoutes);

  const PORT = process.env.PORT_MESSAGES_SERVICE || 8006;
  app.listen(PORT, () => {
    console.log(`Messages service running on port ${PORT}`);
  });
})();