const express = require('express');
const router = express.Router();
const timetableController = require('../controllers/timetableController');
const checkRole = require(`${process.env.NODE_PATH}/middleware/checkRole`);

router.get('/', timetableController.getAllTimetables);
router.post('/', timetableController.createTimetable);
router.put('/:id', timetableController.updateTimetable);
router.delete('/:id', timetableController.deleteTimetable);
router.get('/class/:classId', timetableController.getTimetableByClassId);

module.exports = router;