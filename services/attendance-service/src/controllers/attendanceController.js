const Attendance = require('../models/Attendance');

async function getAllAttendance(req, res) {
    try {
        const db = req.app.locals.db;
        const attendance = await db.collection('attendance').find().toArray();
        res.json(attendance.map(record => new Attendance(record)));
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
}

async function createAttendance(req, res) {
    try {
        const db = req.app.locals.db;
        const attendanceData = req.body;

        Attendance.validate(attendanceData);
        const attendance = new Attendance(attendanceData);

        await db.collection('attendance').insertOne(attendance);
        res.status(201).json(attendance);
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
}

async function updateAttendance(req, res) {
    try {
        const db = req.app.locals.db;
        const attendanceId = req.params.id;
        const attendanceData = req.body;

        Attendance.validate(attendanceData);
        const attendance = new Attendance(attendanceData);

        await db.collection('attendance').updateOne({ _id: attendanceId }, { $set: attendance });
        res.status(200).json(attendance);
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
}

async function deleteAttendance(req, res) {
    try {
        const db = req.app.locals.db;
        const attendanceId = req.params.id;

        await db.collection('attendance').deleteOne({ _id: attendanceId });
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
}

async function getAttendanceByStudentId(req, res) {
    try {
        const db = req.app.locals.db;
        const studentId = req.params.studentId;

        const attendance = await db.collection('attendance').find({ "students.id": studentId }).toArray();
        res.json(attendance);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
}

module.exports = {
    getAllAttendance,
    createAttendance,
    updateAttendance,
    deleteAttendance,
    getAttendanceByStudentId
};