import express from 'express';
import { getLessons } from '../services/timetableService.js';
const router = express.Router();

router.get('/', getLessons);

export default router;