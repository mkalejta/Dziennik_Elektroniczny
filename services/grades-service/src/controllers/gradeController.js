const Grade = require('../models/Grade');

async function getAllGrades(req, res) {
    try {
        const db = req.app.locals.db;
        const grades = await db.collection('grades').find().toArray();
        res.json(grades.map(grade => new Grade(grade)));
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
}

async function createGrade(req, res) {
    try {
        const db = req.app.locals.db;
        const gradeData = req.body;

        Grade.validate(gradeData);
        const grade = new Grade(gradeData);

        await db.collection('grades').insertOne(grade);
        res.status(201).json(grade);
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
}

module.exports = {
    getAllGrades,
    createGrade,
};
