require('dotenv').config();
const express = require('express');
const userRoutes = require('./routes/userRoutes');
const connectMongo = require('./db/mongoClient');
const checkJwt = require(`${process.env.NODE_PATH}/middleware/checkJwt`);
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

(async () => {
  const db = await connectMongo();
  app.locals.db = db;

  app.use('/api/users', checkJwt, userRoutes);
  app.get('/health', (req, res) => res.send('OK'));

  const PORT = process.env.PORT_USER_SERVICE || 8001;
  app.listen(PORT, () => {
    console.log(`User service running on port ${PORT}`);
  });
})();
