const Timetable = require('../models/Timetable');

async function getAllTimetables(req, res) {
    try {
        const db = req.app.locals.db;
        const timetables = await db.collection('timetable').find().toArray();
        res.json(timetables.map(timetable => new Timetable(timetable)));
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
}

async function createTimetable(req, res) {
    try {
        const db = req.app.locals.db;
        const timetableData = req.body;

        Timetable.validate(timetableData);
        const timetable = new Timetable(timetableData);

        await db.collection('timetable').insertOne(timetable);
        res.status(201).json(timetable);
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
}

module.exports = {
    getAllTimetables,
    createTimetable,
};