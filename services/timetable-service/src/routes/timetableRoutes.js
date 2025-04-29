const express = require('express');
const router = express.Router();
const timetableController = require('../controllers/timetableController');

router.get('/', timetableController.getAllTimetables);
router.post('/', timetableController.createTimetable);
router.put('/:id', timetableController.updateTimetable);
router.delete('/:id', timetableController.deleteTimetable);
router.get('/class/:classId', timetableController.getTimetableByClassId);

module.exports = router;