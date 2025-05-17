import express from 'express';
import { getUsers, getUserById, createUser, deleteUser } from '../services/userService.js';
const router = express.Router();

router.get('/', getUsers);
router.post('/', createUser);
router.get('/:id', getUserById);
router.delete('/:id', deleteUser);

export default router;