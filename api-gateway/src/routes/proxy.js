import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

const serviceMap = {
    '/users': `http://users-service:${process.env.PORT_USERS_SERVICE}`,
    '/grades': `http://grades-service:${process.env.PORT_GRADES_SERVICE}`,
    '/subjects': `http://subjects-service:${process.env.PORT_SUBJECTS_SERVICE}`,
    '/attendance': `http://attendance-service:${process.env.PORT_ATTENDANCE_SERVICE}`,
    '/timetable': `http://timetable-service:${process.env.PORT_TIMETABLE_SERVICE}`,
    '/messages': `http://messages-service:${process.env.PORT_MESSAGES_SERVICE}`,
    '/classes': `http://classes-service:${process.env.PORT_CLASS_SERVICE}`,
};

Object.keys(serviceMap).forEach((path) => {
    router.use(
        `${path}`,
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
