const express = require('express');
const session = require('express-session');
const path = require('path');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const indexRoutes = require('./routes/indexRoute.js');
const userRoutes = require('./routes/userRoutes.js');
const timetableRoutes = require('./routes/timetableRoutes.js');
const { ensureValidToken } = require('./middleware/tokenMiddleware.js');

dotenv.config();

const app = express();

const memoryStore = new session.MemoryStore();

app.use(session({
  store: memoryStore,
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

app.use('/', indexRoutes);
app.use('/users', ensureValidToken, userRoutes);
app.use('/timetable', ensureValidToken, timetableRoutes);

app.listen(4000, () => {
  console.log('Admin panel SSR running on http://localhost:4000');
});
