const pgClient = require('../db/pgClient');

// Funkcja walidująca dane oceny
function validateGradeData(gradeData) {
    if (!gradeData.studentId || typeof gradeData.studentId !== 'string') {
        throw new Error('Invalid or missing "studentId"');
    }
    if (gradeData.grade === undefined || typeof gradeData.grade !== 'number') {
        throw new Error('Invalid or missing "grade"');
    }
    if (gradeData.grade < 1 || gradeData.grade > 6) {
        throw new Error('Grade must be between 1 and 6');
    }
    if (!gradeData.subjectId || typeof gradeData.subjectId !== 'string') {
        throw new Error('Invalid or missing "subjectId"');
    }
    if (!gradeData.teacherId || typeof gradeData.teacherId !== 'string') {
        throw new Error('Invalid or missing "teacherId"');
    }
}


async function getAllGrades(req, res) {
    try {
        const result = await pgClient.query('SELECT * FROM grades');
        res.json(result.rows);
    } catch (error) {
        console.error('Błąd przy pobieraniu ocen:', error);
        res.status(500).send('Internal server error');
    }
}

async function createGrade(req, res) {
    const gradeData = req.body;

    try {
        validateGradeData(gradeData);

        const result = await pgClient.query(
            `INSERT INTO grades (student_id, grade, subject_id, teacher_id) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [gradeData.studentId, gradeData.grade, gradeData.subjectId, gradeData.teacherId]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Błąd przy tworzeniu oceny:', error);
        res.status(400).send(error.message);
    }
}

async function getGradeById(req, res) {
    const gradeId = req.params.gradeId;

    try {
        const result = await pgClient.query(
            `SELECT * FROM grades WHERE id = $1`,
            [gradeId]
        );

        if (result.rowCount === 0) {
            return res.status(404).send('Grade not found');
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Błąd przy pobieraniu oceny:', error);
        res.status(500).send('Internal server error');
    }
}

async function updateGrade(req, res) {
    const gradeId = req.params.gradeId;
    const gradeData = req.body;

    try {
        validateGradeData(gradeData);

        const result = await pgClient.query(
            `UPDATE grades SET student_id = $1, grade = $2, subject_id = $3, teacher_id = $4 
             WHERE id = $5 RETURNING *`,
            [gradeData.studentId, gradeData.grade, gradeData.subjectId, gradeData.teacherId, gradeId]
        );

        if (result.rowCount === 0) {
            return res.status(404).send('Grade not found');
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Błąd przy aktualizacji oceny:', error);
        res.status(400).send(error.message);
    }
}

async function deleteGrade(req, res) {
    const gradeId = req.params.gradeId;

    try {
        const result = await pgClient.query('DELETE FROM grades WHERE id = $1', [gradeId]);

        if (result.rowCount === 0) {
            return res.status(404).send('Grade not found');
        }

        res.status(204).send();
    } catch (error) {
        console.error('Błąd przy usuwaniu oceny:', error);
        res.status(500).send('Internal server error');
    }
}

async function getGradesByStudentIdAndSubjectId(req, res) {
    const studentId = req.params.studentId;
    const subjectId = req.params.subjectId;

    try {
        const result = await pgClient.query(
            `SELECT * FROM grades WHERE student_id = $1 AND subject_id = $2`,
            [studentId, subjectId]
        );

        if (result.rowCount === 0) {
            return res.status(404).send('No grades found for this student and subject');
        }

        res.json(result.rows);
    } catch (error) {
        console.error('Błąd przy pobieraniu ocen:', error);
        res.status(500).send('Internal server error');
    }
}


module.exports = {
    getAllGrades,
    createGrade,
    getGradeById,
    updateGrade,
    deleteGrade,
    getGradesByStudentIdAndSubjectId
};
