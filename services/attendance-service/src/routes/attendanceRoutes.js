const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const checkRole = require(`${process.env.NODE_PATH}/middleware/checkRole`);

router.get('/', attendanceController.getAllAttendance);
router.post('/', attendanceController.createAttendance);
router.put('/:id', attendanceController.updateAttendance);
router.delete('/:id', attendanceController.deleteAttendance);
router.get('/student/:studentId', attendanceController.getAttendanceByStudentId);

module.exports = router;