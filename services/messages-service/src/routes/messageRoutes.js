const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const checkRole = require(`${process.env.NODE_PATH}/middleware/checkRole`);

router.get('/', messageController.getAllMessages);
router.post('/', messageController.createMessage);
router.get('/:conversationId', messageController.getConversation);
router.put('/:conversationId', messageController.updateConversation);

module.exports = router;