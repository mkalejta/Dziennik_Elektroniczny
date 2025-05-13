const Attendance = require('../models/Attendance');
const { ObjectId } = require('mongodb');
const pgClient = require('../db/pgClient');

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

        await db.collection('attendance').updateOne(
            { _id: new ObjectId(attendanceId) },
            { $set: attendanceWithoutId }
        );
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

        const attendance = await db.collection('attendance').find({ students: { $ne: studentId } }).toArray();

        const result = await convertAttendance(attendance, db);

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
}

async function getAttendanceByParentId(req, res) {
    try {
        const db = req.app.locals.db;
        const parentId = req.params.parentId;

        const parentChild = await db.collection('parent_child').find({ parentId }).toArray();
        const childIds = parentChild.map(pc => pc.childId);

        const childId = childIds[0];
        
        if (!childId) {
            return res.status(404).send('No children found for this parent');
        }

        const attendance = await db.collection('attendance').find({ students: { $ne: childId } }).toArray();

        const result = await convertAttendance(attendance, db);

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
}

async function getAttendanceByTeacherId(req, res) {
    try {
        const db = req.app.locals.db;
        const teacherId = req.params.teacherId;
        const attendance = await db.collection('attendance').find({ teacherId }).toArray();

        const subjectIds = [...new Set(attendance.map(record => record.subjectId))];
        const { rows: subjects } = await pgClient.query(
            'SELECT id, name, class_id FROM subjects WHERE id = ANY($1)',
            [subjectIds]
        );

        const subjectMap = subjects.reduce((acc, subject) => {
            acc[subject.id] = { name: subject.name, classId: subject.class_id };
            return acc;
        }, {});

        const enrichedAttendance = attendance.map(record => ({
            id: record._id,
            subjectName: subjectMap[record.subjectId]?.name,
            subjectId: record.subjectId,
            classId: subjectMap[record.subjectId]?.classId,
            date: record.date,
            students: record.students
        }));

        // Grupowanie według daty
        const groupedData = enrichedAttendance.reduce((acc, record) => {
            const date = new Date(record.date).toLocaleDateString();
            if (!acc[date]) acc[date] = [];
            acc[date].push(record);
            return acc;
        }, {});

        // Sortowanie według daty
        const sortedData = Object.entries(groupedData).sort(
            ([dateA], [dateB]) => new Date(dateB) - new Date(dateA)
        );

        res.json(sortedData);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
}

async function convertAttendance(attendance, db) {
        const teacherIds = [...new Set(attendance.map(record => record.teacherId))];
        const teachers = await db.collection('users').find({ _id: { $in: teacherIds } }).toArray();

        const teacherMap = teachers.reduce((acc, teacher) => {
            acc[teacher._id] = `${teacher.name} ${teacher.surname}`;
            return acc;
        }, {});

        const subjectIds = [...new Set(attendance.map(record => record.subjectId))];
        const { rows: subjects } = await pgClient.query(
            'SELECT id, name FROM subjects WHERE id = ANY($1)',
            [subjectIds]
        );

        const subjectMap = subjects.reduce((acc, subject) => {
            acc[subject.id] = subject.name;
            return acc;
        }, {});

        const enrichedAttendance = attendance.map(record => ({
            teacherName: teacherMap[record.teacherId],
            subjectName: subjectMap[record.subjectId],
            date: record.date,
        }));

        // Grupowanie według daty
        const groupedData = enrichedAttendance.reduce((acc, record) => {
            const date = new Date(record.date).toLocaleDateString();
            if (!acc[date]) acc[date] = [];
            acc[date].push(record);
            return acc;
        }, {});

        // Sortowanie według daty
        const sortedData = Object.entries(groupedData).sort(
            ([dateA], [dateB]) => new Date(dateB) - new Date(dateA)
        );

        return sortedData;
}

module.exports = {
    getAllAttendance,
    createAttendance,
    getAttendanceById,
    updateAttendance,
    deleteAttendance,
    getAttendanceByStudentId,
    getAttendanceByParentId,
    getAttendanceByTeacherId
};