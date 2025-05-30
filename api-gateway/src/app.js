import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import proxyRouter from './routes/proxy.js';
import cors from 'cors';

dotenv.config();
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

app.use('/api', proxyRouter);

app.get('/', (req, res) => {
  res.send('API Gateway działa');
});

app.get('/health', (req, res) => {
  res.send('OK');
});

const PORT = process.env.PORT_API_GATEWAY || 8081;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API Gateway listening on port ${PORT}`);
});
