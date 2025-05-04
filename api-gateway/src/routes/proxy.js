import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { checkAuth } from '../middleware/checkAuth.js';

const router = express.Router();

const serviceMap = {
    '/users': 'http://users-service:8001',
    '/grades': 'http://grades-service:8002',
    '/subjects': 'http://subjects-service:8003',
    '/attendance': 'http://attendance-service:8004',
    '/timetable': 'http://timetable-service:8005',
    '/messages': 'http://messages-service:8006',
    '/classes': 'http://classes-service:8007',
};

Object.keys(serviceMap).forEach((path) => {
    router.use(
        `${path}`,
        checkAuth,
        createProxyMiddleware({
            target: serviceMap[path],
            changeOrigin: true,
            onProxyReq: (proxyReq, req) => {
                if (req.body && typeof req.body === 'object') {
                    const bodyData = JSON.stringify(req.body);
                    proxyReq.setHeader('Content-Type', 'application/json');
                    proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
                    proxyReq.write(bodyData);
                }
            },
        })
    );
});

export default router;
