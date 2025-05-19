const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/gradeController');
const checkRole = require(`${process.env.NODE_PATH}/middleware/checkRole`);

router.get('/', gradeController.getAllGrades);
router.post('/', checkRole('teacher'), gradeController.createGrade);
router.get('/:gradeId', gradeController.getGradeById);
router.put('/:gradeId', checkRole('teacher'), gradeController.updateGrade);
router.delete('/:gradeId', checkRole('teacher'), gradeController.deleteGrade);
router.get('/student/:studentId', gradeController.getGradesByStudentId);
router.get('/parent/:parentId', gradeController.getGradesByParentId);
router.get('/student/:studentId/subject/:subjectId', gradeController.getGradesByStudentIdAndSubjectId);
router.get('/teacher/:teacherId', gradeController.getGradesByTeacherIdGroupedByClass);

module.exports = router;
