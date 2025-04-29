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

module.exports = {
    getAllAttendance,
    createAttendance,
};