import express from 'express';
import { login, handleRedirect, logout } from '../controllers/authController.js';

const router = express.Router();

router.get('/login', login);
router.get('/redirect', handleRedirect);
router.get('/logout', logout);

export default router;
