const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const checkRole = require(`${process.env.NODE_PATH}/middleware/checkRole`);

router.get('/', classController.getClasses);
router.post('/', classController.createClass);
router.delete('/:classId', classController.deleteClass);
router.get('/:classId/students', classController.getStudentsInClass);
router.get('/teacher/:teacherId', classController.getClassesByTeacherId);

module.exports = router;
