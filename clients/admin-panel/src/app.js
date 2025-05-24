const express = require('express');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const { createClient } = require('redis');
const path = require('path');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const indexRoutes = require('./routes/indexRoute.js');
const userRoutes = require('./routes/userRoutes.js');
const timetableRoutes = require('./routes/timetableRoutes.js');
const { ensureValidToken } = require('./middleware/tokenMiddleware.js');

dotenv.config();

const app = express();

const redisClient = createClient({ url: 'redis://redis:6379' });
redisClient.connect().catch(console.error);

const redisStore = new RedisStore({
  client: redisClient,
  prefix: "sess:"
});

app.use(session({
  store: redisStore,
  secret: process.env.ADMIN_SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 15
  }
}));

app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (req, res) => res.send('OK'));
app.use('/', indexRoutes);
app.use('/users', ensureValidToken, userRoutes);
app.use('/timetable', ensureValidToken, timetableRoutes);

app.listen(4000, () => {
  console.log('Admin panel SSR running on http://localhost:4000');
});
