const pgClient = require('../db/pgClient');
const { ObjectId } = require('mongodb');

// Funkcja walidująca id klasy
function validateClassId(classId) {
  if (!classId) {
    throw new Error('Class ID is required');
  }
  if (typeof classId !== 'string') {
    throw new Error('Class ID must be a string');
  }
  if (!/^[1-4]{1}[A-D]{1}$/.test(classId)) {
    throw new Error('Class ID must consist of 1 number and 1 uppercase letter');
  }
}


async function getClasses(req, res) {
  try {
    const result = await pgClient.query('SELECT * FROM class ORDER BY id ASC');
    res.json(result.rows.map(row => row.id));
  } catch (error) {
    console.error('Błąd przy pobieraniu klas:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function createClass(req, res) {
  const classData = req.body;

  try {
    validateClassId(classData.id);

    const result = await pgClient.query(
      'INSERT INTO class (id, name) VALUES ($1, $2) RETURNING id',
      [classData.id, classData.name]
    );

    res.status(201).json({ classId: result.rows[0].id });
  } catch (error) {
    console.error('Błąd przy tworzeniu klasy:', error);
    res.status(400).json({ error: error.message });
  }
}

async function deleteClass(req, res) {
  const classId = req.params.classId;

  try {
    await pgClient.query('DELETE FROM class WHERE id = $1', [classId]);
    res.status(204).send();
  } catch (error) {
    console.error('Błąd przy usuwaniu klasy:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getStudentsInClass(req, res) {
  const classId = req.params.classId;

  try {
    const result = await pgClient.query(
      'SELECT * FROM students_classes WHERE class_id = $1',
      [classId]
    );
    
    const studentIds = result.rows.map(row => row.student_id);

    if (studentIds.length === 0) {
      return res.json([]);
    }
    const db = req.app.locals.db;
    const usersCollection = db.collection('users');

    const students = await usersCollection
      .find({ _id: { $in: studentIds }, role: 'student' })
      .project({ password: 0 }) // Nie zwracam haseł
      .toArray();

    res.json(students);
  } catch (error) {
    console.error('Błąd przy pobieraniu uczniów z klasy:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getClasses,
  createClass,
  deleteClass,
  getStudentsInClass
};
