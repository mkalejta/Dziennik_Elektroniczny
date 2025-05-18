const express = require('express');
const { getUsers, getUserById, createUser, deleteUser } = require('../services/userService.js');
const router = express.Router();

router.get('/', getUsers);
router.post('/', createUser);
router.get('/:id', getUserById);
router.delete('/:id', deleteUser);

module.exports = router;