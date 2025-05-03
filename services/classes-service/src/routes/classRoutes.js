const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const checkRole = require(`${process.env.NODE_PATH}/middleware/checkRole`);

router.get('/', classController.getClasses);
router.post('/', classController.createClass);
router.put('/:classId', classController.updateClass);
router.delete('/:classId', classController.deleteClass);
router.get('/:classId/students', classController.getStudentsInClass);

module.exports = router;
