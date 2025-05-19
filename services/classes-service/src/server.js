require('dotenv').config();
const express = require('express');
const classRoutes = require('./routes/classRoutes');
const connectMongo = require('./db/mongoClient');
const checkJwt = require(`${process.env.NODE_PATH}/middleware/checkJwt`);
const { startEventListeners } = require('./events/userEvents');

const app = express();
app.use(express.json());

(async () => {
  try {
    const db = await connectMongo();
    app.locals.db = db;

    app.use('/api/classes', checkJwt, classRoutes);

    startEventListeners();

    const PORT = process.env.PORT_CLASS_SERVICE || 8007;
    app.listen(PORT, () => {
      console.log(`Class service running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Błąd podczas uruchamiania serwera:', error);
    process.exit(1);
  }
})();
