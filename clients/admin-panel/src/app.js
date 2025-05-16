import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { keycloak, memoryStore } from './auth/keycloak.js';
import indexRoutes from './routes/indexRoute.js';
import userRoutes from './routes/userRoutes.js';
import timetableRoutes from './routes/timetableRoutes.js';
dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(session({
  secret: process.env.ADMIN_SESSION_SECRET || 'default-secret',
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

app.use(keycloak.middleware());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRoutes);
app.use('/users', keycloak.protect('realm:admin'), userRoutes);
app.use('/timetable', keycloak.protect('realm:admin'), timetableRoutes);

app.listen(4000, () => {
  console.log('Admin panel SSR running on http://localhost:4000');
});
