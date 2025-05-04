const pgClient = require('../db/pgClient');

function validateSubject(subjectData) {
    if (!subjectData.subject_id || typeof subjectData.subject_id !== 'string') {
        throw new Error('Invalid or missing "subject_id"');
    }
    if (!subjectData.name || typeof subjectData.name !== 'string') {
        throw new Error('Invalid or missing "name"');
    }
    if (!subjectData.class_id || typeof subjectData.class_id !== 'string') {
        throw new Error('Invalid or missing "class_id"');
    }
    if (!subjectData.teacher_id || typeof subjectData.teacher_id !== 'string') {
        throw new Error('Invalid or missing "teacher_id"');
    }
}

async function getAllSubjects(req, res) {
    try {
        const result = await pgClient.query('SELECT * FROM subjects');
        res.json(result.rows);
    } catch (error) {
        console.error('Błąd przy pobieraniu przedmiotów:', error);
        res.status(500).send('Internal server error');
    }
}

async function createSubject(req, res) {
    const subjectData = req.body;

    try {
        validateSubject(subjectData);

        const result = await pgClient.query(
            `INSERT INTO subjects (id, name, class_id, teacher_id) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [subjectData.subject_id, subjectData.name, subjectData.class_id, subjectData.teacher_id]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Błąd przy tworzeniu przedmiotu:', error);
        res.status(400).send(error.message);
    }
}

async function updateSubject(req, res) {
    const subjectId = req.params.id;
    const subjectData = req.body;

    try {
        validateSubject(subjectData);

        const result = await pgClient.query(
            `UPDATE subjects SET name = $1, class_id = $2, teacher_id = $3 
             WHERE id = $4 RETURNING *`,
            [subjectData.name, subjectData.class_id, subjectData.teacher_id, subjectId]
        );

        if (result.rowCount === 0) {
            return res.status(404).send('Subject not found');
        }

        res.status(200).json(result.rows[0]);
    }
    catch (error) {
        console.error('Błąd przy aktualizacji przedmiotu:', error);
        res.status(400).send(error.message);
    }
}

async function deleteSubject(req, res) {
    const subjectId = req.params.id;

    try {
        const result = await pgClient.query('DELETE FROM subjects WHERE id = $1', [subjectId]);

        if (result.rowCount === 0) {
            return res.status(404).send('Subject not found');
        }

        res.status(204).send();
    } catch (error) {
        console.error('Błąd przy usuwaniu przedmiotu:', error);
        res.status(500).send('Internal server error');
    }
}

module.exports = {
    getAllSubjects,
    createSubject,
    updateSubject,
    deleteSubject
};