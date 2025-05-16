import express from 'express';
import { getUsers } from '../services/userService.js';
const router = express.Router();

router.get('/', getUsers);

export default router;