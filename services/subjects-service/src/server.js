require('dotenv').config();
const express = require('express');
const subjectRoutes = require('./routes/subjectRoutes');
const connectMongo = require('./db/mongoClient');
const checkJwt = require(`${process.env.NODE_PATH}/middleware/checkJwt`);
const { startEventListeners } = require('./events/userEvents');

const app = express();
app.use(express.json());

(async () => {
  const db = await connectMongo();
  app.locals.db = db;

  startEventListeners();

  app.use('/api/subjects', checkJwt, subjectRoutes);
  app.get('/health', (req, res) => res.send('OK'));

  const PORT = process.env.PORT_SUBJECTS_SERVICE || 8003;
  app.listen(PORT, () => {
    console.log(`Subjects service running on port ${PORT}`);
  });
})();
