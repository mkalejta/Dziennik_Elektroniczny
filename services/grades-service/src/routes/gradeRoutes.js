const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/gradeController');

router.get('/', gradeController.getAllGrades);
router.post('/', gradeController.createGrade);

module.exports = router;
