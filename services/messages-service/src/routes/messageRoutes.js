const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const checkRole = require(`${process.env.NODE_PATH}/middleware/checkRole`);

router.get('/', messageController.getAllMessages);
router.post('/', messageController.createMessage);
router.get('/:conversationId', messageController.getMessages);
router.put('/:conversationId', messageController.updateMessages);
router.get('/user/:userId', messageController.getMessagesByUserId);
router.get('/teacher/:teacherId', messageController.getMessagesByTeacherId);

module.exports = router;