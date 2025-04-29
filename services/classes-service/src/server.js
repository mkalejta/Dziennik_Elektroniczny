require('dotenv').config();
const express = require('express');
const classRoutes = require('./routes/classRoutes');
const connectMongo = require('./db/mongoClient');

const app = express();
app.use(express.json());

(async () => {
  const db = await connectMongo();
  app.locals.db = db;

  app.use('/api/classes', classRoutes);

  const PORT = process.env.PORT_CLASS_SERVICE || 8007;
  app.listen(PORT, () => {
    console.log(`Class service running on port ${PORT}`);
  });
})();
