import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import proxyRouter from './routes/proxy.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();
const app = express();

app.use(cookieParser());
app.use(express.json());

app.use('/api', proxyRouter);
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('API Gateway działa');
});

const PORT = process.env.API_GATEWAY_PORT || 8081;
app.listen(PORT, () => {
  console.log(`API Gateway listening on port ${PORT}`);
});
