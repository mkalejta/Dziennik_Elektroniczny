const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const checkRole = require(`${process.env.NODE_PATH}/middleware/checkRole`);

router.get('/', attendanceController.getAllAttendance);
router.post('/', attendanceController.createAttendance);
router.get('/:id', attendanceController.getAttendanceById);
router.put('/:id', attendanceController.updateAttendance);
router.delete('/:id', attendanceController.deleteAttendance);
router.get('/student/:studentId', attendanceController.getAttendanceByStudentId);
router.get('/parent/:parentId', attendanceController.getAttendanceByParentId);
router.get('/teacher/:teacherId', attendanceController.getAttendanceByTeacherId);

module.exports = router;