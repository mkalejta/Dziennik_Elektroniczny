const express = require('express');
const router = express.Router();
const { getStudentsInClass } = require('../controllers/classController');

router.get('/:classId/students', getStudentsInClass);

module.exports = router;
