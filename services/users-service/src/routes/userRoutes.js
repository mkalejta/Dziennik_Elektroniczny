const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const checkRole = require(`${process.env.NODE_PATH}/middleware/checkRole`);

router.get('/', userController.getAllUsers);
router.post('/', checkRole('admin'), userController.createUser);
router.get('/:id', userController.getUser);
router.delete('/:id', checkRole('admin'), userController.deleteUser);
router.get('/:id/class', userController.getUserClass);
router.get('/:id/receivers', userController.getPossibleMesageReceivers);

module.exports = router;
