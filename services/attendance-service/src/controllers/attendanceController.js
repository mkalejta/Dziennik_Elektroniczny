const Attendance = require('../models/Attendance');
const { ObjectId } = require('mongodb');

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

async function getAttendanceById(req, res) {
    try {
        const db = req.app.locals.db;
        const attendanceId = req.params.id;

        const attendance = await db.collection('attendance').findOne({ _id: new ObjectId(attendanceId) });
        if (!attendance) {
            return res.status(404).send('Attendance not found');
        }
        res.json(new Attendance(attendance));
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
}

async function updateAttendance(req, res) {
    try {
        const db = req.app.locals.db;
        const attendanceId = req.params.id;
        const attendanceData = req.body;

        Attendance.validate(attendanceData);
        const { _id, ...attendanceWithoutId } = new Attendance(attendanceData);

        await db.collection('attendance').updateOne({ _id: new ObjectId(attendanceId) }, { $set: attendanceWithoutId });
        res.status(200).json(attendanceWithoutId);
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
}

async function deleteAttendance(req, res) {
    try {
        const db = req.app.locals.db;
        const attendanceId = req.params.id;

        await db.collection('attendance').deleteOne({ _id: new ObjectId(attendanceId) });
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

        const attendance = await db.collection('attendance').find({ students: studentId }).toArray();
        res.json(attendance);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
}

module.exports = {
    getAllAttendance,
    createAttendance,
    getAttendanceById,
    updateAttendance,
    deleteAttendance,
    getAttendanceByStudentId
};