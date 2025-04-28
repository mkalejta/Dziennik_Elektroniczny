require('dotenv').config();
const express = require('express');
const userRoutes = require('./routes/userRoutes');
const connectMongo = require('./db/mongoClient');

const app = express();
app.use(express.json());

(async () => {
  const db = await connectMongo();
  app.locals.db = db;

  app.use('/api/users', userRoutes);

  const PORT = process.env.PORT_USER_SERVICE || 8001;
  app.listen(PORT, () => {
    console.log(`User service running on port ${PORT}`);
  });
})();
