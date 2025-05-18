const express = require('express');
const {
    getLessons, 
    createLesson, 
    getLessonById, 
    updateLesson, 
    deleteLesson, 
    getLessonByClassId,
    getLessonByTeacherId
 } = require('../services/timetableService.js');
const router = express.Router();

router.get('/', getLessons);
router.post('/', createLesson);
router.get('/:id', getLessonById);
router.put('/:id', updateLesson);
router.delete('/:id', deleteLesson);
router.get('/class/:classId', getLessonByClassId);
router.get('/teacher/:teacherId', getLessonByTeacherId);

module.exports = router;