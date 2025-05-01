import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { checkAuth } from '../middleware/checkAuth.js';

const router = express.Router();

const proxy = createProxyMiddleware({
    target: 'http://users-service:8001',
    changeOrigin: true,
    pathRewrite: {
        '^/api/users': '',
    },
    onProxyReq: (proxyReq, req) => {
        const token = req.cookies['access_token'];
        if (token) {
            proxyReq.setHeader('Authorization', `Bearer ${token}`);
        }
    }
});

router.use('/users', checkAuth, proxy);

export default router;
