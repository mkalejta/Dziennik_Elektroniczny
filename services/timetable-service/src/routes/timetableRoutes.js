const express = require('express');
const router = express.Router();
const timetableController = require('../controllers/timetableController');

router.get('/', timetableController.getAllTimetables);
router.post('/', timetableController.createTimetable);

module.exports = router;