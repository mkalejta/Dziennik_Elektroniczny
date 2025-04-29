const Subject = require('../models/Subject');

async function getAllSubjects(req, res) {
    try {
        const db = req.app.locals.db;
        const subjects = await db.collection('subjects').find().toArray();
        res.json(subjects.map(subject => new Subject(subject)));
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
}

async function createSubject(req, res) {
    try {
        const db = req.app.locals.db;
        const subjectData = req.body;

        Subject.validate(subjectData);
        const subject = new Subject(subjectData);

        await db.collection('subjects').insertOne(subject);
        res.status(201).json(subject);
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
}

module.exports = {
    getAllSubjects,
    createSubject,
};