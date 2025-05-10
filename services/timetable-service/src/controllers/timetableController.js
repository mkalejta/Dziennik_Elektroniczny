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
    if (!timetableData.day || typeof timetableData.day !== 'string') {
        throw new Error('Invalid or missing "day"');
    }
    if (!timetableData.start_at || typeof timetableData.start_at !== 'string') {
        throw new Error('Invalid or missing "start_at"');
    }
    if (!timetableData.finish_at || typeof timetableData.finish_at !== 'string') {
        throw new Error('Invalid or missing "finish_at"');
    }
}

async function getAllTimetables(req, res) {
    try {
        const result = await pgClient.query(
            `SELECT id, class_id, subject_id, teacher_id, day,
                    TO_CHAR(start_at, 'HH24:MI') AS start_at,
                    TO_CHAR(finish_at, 'HH24:MI') AS finish_at
            FROM timetable`
        );
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
            `INSERT INTO timetable (class_id, subject_id, teacher_id, day, start_at, finish_at) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [
                timetableData.class_id,
                timetableData.subject_id,
                timetableData.teacher_id,
                timetableData.day,
                timetableData.start_at,
                timetableData.finish_at,
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Błąd przy tworzeniu planu zajęć:', error);
        res.status(400).send(error.message);
    }
}

async function getTimetableById(req, res) {
    const timetableId = req.params.id;

    try {
        const result = await pgClient.query(
            `SELECT id, class_id, subject_id, teacher_id, day,
                    TO_CHAR(start_at, 'HH24:MI') AS start_at,
                    TO_CHAR(finish_at, 'HH24:MI') AS finish_at
            FROM timetable
            WHERE id = $1`,
            [timetableId]
        );

        if (result.rowCount === 0) {
            return res.status(404).send('Timetable not found');
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Błąd przy pobieraniu planu zajęć:', error);
        res.status(500).send('Internal server error');
    }
}

async function updateTimetable(req, res) {
    const timetableId = req.params.id;
    const timetableData = req.body;

    try {
        validateTimetable(timetableData);

        const result = await pgClient.query(
            `UPDATE timetable SET class_id = $1, subject_id = $2, teacher_id = $3, 
             day = $4, start_at = $5, finish_at = $6 
             WHERE id = $7 RETURNING *`,
            [
                timetableData.class_id,
                timetableData.subject_id,
                timetableData.teacher_id,
                timetableData.day,
                timetableData.start_at,
                timetableData.finish_at,
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
        const timetableResult = await pgClient.query(
            `SELECT id, subject_id, teacher_id, day,
                    TO_CHAR(start_at, 'HH24:MI') AS start_at,
                    TO_CHAR(finish_at, 'HH24:MI') AS finish_at
            FROM timetable
            WHERE class_id = $1`,
            [classId]
        );

        if (timetableResult.rowCount === 0) {
            return res.status(404).send('No lessons found for this class');
        }

        const subjectsResult = await pgClient.query(`SELECT * FROM subjects`);
        const subjectsMap = new Map(subjectsResult.rows.map(s => [s.id, s.name]));

        const db = req.app.locals.db;

        const result = await Promise.all(
            timetableResult.rows.map(async (lesson) => {
                const teacher = await db.collection('users').findOne({ _id: lesson.teacher_id });
                return {
                    id: lesson.id,
                    subject: subjectsMap.get(lesson.subject_id) || null,
                    teacher: teacher.name || null,
                    day: lesson.day,
                    start_at: lesson.start_at,
                    finish_at: lesson.finish_at
                };
            })
        );

        res.json(result);
    } catch (error) {
        console.error('Błąd przy pobieraniu planu zajęć dla klasy:', error);
        res.status(500).send('Internal server error');
    }
}

module.exports = {
    getAllTimetables,
    createTimetable,
    getTimetableById,
    updateTimetable,
    deleteTimetable,
    getTimetableByClassId
};