const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/gradeController');
const checkRole = require(`${process.env.NODE_PATH}/middleware/checkRole`);

router.post('/', gradeController.createGrade);
router.get('/:gradeId', gradeController.getGradeById);
router.put('/:gradeId', gradeController.updateGrade);
router.delete('/:gradeId', gradeController.deleteGrade);
router.get('/student/:studentId/subject/:subjectId', gradeController.getGradesByStudentIdAndSubjectId);

module.exports = router;
