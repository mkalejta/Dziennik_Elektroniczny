const pgClient = require('../db/pgClient');

function validateTimetable(timetableData) {
    if (!timetableData.class_id || typeof timetableData.class_id !== 'string') {
        throw new Error('Invalid or missing "class_id"');
    }
    if (!timetableData.subject_id || typeof timetableData.subject_id !== 'string') {
        throw new Error('Invalid or missing "subject_id"');
    }
    if (!timetableData.teacher_id || typeof timetableData.teacher_id !== 'string') {
        throw new Error('Invalid or missing "teacher_id"');
    }
    if (!timetableData.day_of_week || typeof timetableData.day_of_week !== 'string') {
        throw new Error('Invalid or missing "day_of_week"');
    }
    if (!timetableData.start_time || typeof timetableData.start_time !== 'string') {
        throw new Error('Invalid or missing "start_time"');
    }
    if (!timetableData.end_time || typeof timetableData.end_time !== 'string') {
        throw new Error('Invalid or missing "end_time"');
    }
}

async function getAllTimetables(req, res) {
    try {
        const result = await pgClient.query('SELECT * FROM timetable');
        res.json(result.rows);
    } catch (error) {
        console.error('Błąd przy pobieraniu planu zajęć:', error);
        res.status(500).send('Internal server error');
    }
}

async function createTimetable(req, res) {
    const timetableData = req.body;

    try {
        validateTimetable(timetableData);

        const result = await pgClient.query(
            `INSERT INTO timetable (id, class_id, subject_id, teacher_id, day_of_week, start_time, end_time) 
             VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6) RETURNING *`,
            [
                timetableData.class_id,
                timetableData.subject_id,
                timetableData.teacher_id,
                timetableData.day_of_week,
                timetableData.start_time,
                timetableData.end_time,
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Błąd przy tworzeniu planu zajęć:', error);
        res.status(400).send(error.message);
    }
}

async function updateTimetable(req, res) {
    const timetableId = req.params.id;
    const timetableData = req.body;

    try {
        validateTimetable(timetableData);

        const result = await pgClient.query(
            `UPDATE timetable SET class_id = $1, subject_id = $2, teacher_id = $3, 
             day_of_week = $4, start_time = $5, end_time = $6 
             WHERE id = $7 RETURNING *`,
            [
                timetableData.class_id,
                timetableData.subject_id,
                timetableData.teacher_id,
                timetableData.day_of_week,
                timetableData.start_time,
                timetableData.end_time,
                timetableId,
            ]
        );

        if (result.rowCount === 0) {
            return res.status(404).send('Timetable not found');
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Błąd przy aktualizacji planu zajęć:', error);
        res.status(400).send(error.message);
    }
}

async function deleteTimetable(req, res) {
    const timetableId = req.params.id;

    try {
        const result = await pgClient.query('DELETE FROM timetable WHERE id = $1', [timetableId]);

        if (result.rowCount === 0) {
            return res.status(404).send('Timetable not found');
        }

        res.status(204).send();
    } catch (error) {
        console.error('Błąd przy usuwaniu planu zajęć:', error);
        res.status(500).send('Internal server error');
    }
}

async function getTimetableByClassId(req, res) {
    const classId = req.params.classId;

    try {
        const result = await pgClient.query(
            `SELECT * FROM timetable WHERE class_id = $1`,
            [classId]
        );

        if (result.rowCount === 0) {
            return res.status(404).send('Timetable not found for this class');
        }

        res.json(result.rows);
    } catch (error) {
        console.error('Błąd przy pobieraniu planu zajęć dla klasy:', error);
        res.status(500).send('Internal server error');
    }
}

module.exports = {
    getAllTimetables,
    createTimetable,
    updateTimetable,
    deleteTimetable,
    getTimetableByClassId
};