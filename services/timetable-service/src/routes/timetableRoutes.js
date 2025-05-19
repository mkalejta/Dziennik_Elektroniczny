const express = require('express');
const router = express.Router();
const timetableController = require('../controllers/timetableController');
const checkRole = require(`${process.env.NODE_PATH}/middleware/checkRole`);

router.get('/', timetableController.getAllTimetables);
router.post('/', checkRole('admin'), timetableController.createTimetable);
router.get('/:id', timetableController.getTimetableById);
router.put('/:id', checkRole('admin'), timetableController.updateTimetable);
router.delete('/:id', checkRole('admin'), timetableController.deleteTimetable);
router.get('/class/:classId', timetableController.getTimetableByClassId);
router.get(`/teacher/:teacherId`, timetableController.getTimetableByTeacherId);

module.exports = router;