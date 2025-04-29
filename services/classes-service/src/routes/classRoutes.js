const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');

router.get('/', classController.getClasses);
router.post('/', classController.createClass);
router.put('/:classId', classController.updateClass);
router.delete('/:classId', classController.deleteClass);
router.get('/:classId/students', classController.getStudentsInClass);

module.exports = router;
