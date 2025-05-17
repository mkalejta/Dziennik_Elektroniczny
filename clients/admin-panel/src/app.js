import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { memoryStore } from './auth/keycloak.js';
import indexRoutes from './routes/indexRoute.js';
import userRoutes from './routes/userRoutes.js';
import timetableRoutes from './routes/timetableRoutes.js';
import { ensureValidToken } from './middleware/tokenMiddleware.js';
import bodyParser from 'body-parser';
dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
