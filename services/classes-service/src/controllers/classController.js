const pgClient = require('../db/pgClient');

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
      .toArray();

    res.json(students);
  } catch (error) {
    console.error('Błąd przy pobieraniu uczniów z klasy:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getClassesByTeacherId(req, res) {
  const teacherId = req.params.teacherId;

  try {
    // Klasy i przedmioty prowadzone przez nauczyciela
    const result = await pgClient.query(
      `SELECT c.id AS class_id, s.name AS subject_name, s.id AS subject_id
       FROM class c
       JOIN subjects s ON c.id = s.class_id
       WHERE s.teacher_id = $1`,
      [teacherId]
    );

    const classes = result.rows;

    if (classes.length === 0) {
      return res.json([]);
    }

    const classIds = classes.map((cls) => cls.class_id);
    const studentsClassesResult = await pgClient.query(
      `SELECT student_id, class_id FROM students_classes WHERE class_id = ANY($1)`,
      [classIds]
    );

    const studentsClasses = studentsClassesResult.rows;

    const studentIds = [...new Set(studentsClasses.map((sc) => sc.student_id))];
    const db = req.app.locals.db;
    const usersCollection = db.collection('users');

    const students = await usersCollection
      .find({ _id: { $in: studentIds }, role: 'student' })
      .project({ _id: 1, name: 1, surname: 1 })
      .toArray();

    // Grupowanie uczniów według klas
    const studentsByClass = classIds.reduce((acc, classId) => {
      acc[classId] = studentsClasses
        .filter((sc) => sc.class_id === classId)
        .map((sc) => {
          const student = students.find((s) => s._id === sc.student_id);
          return student
            ? { id: student._id, name: student.name, surname: student.surname }
            : null;
        })
        .filter(Boolean); // Usuń null, jeśli student nie został znaleziony
      return acc;
    }, {});

    const classesWithStudents = classes.map((cls) => ({
      id: cls.class_id,
      subjectId: cls.subject_id,
      subjectName: cls.subject_name,
      students: studentsByClass[cls.class_id] || [],
    }));

    res.json(classesWithStudents);
  } catch (error) {
    console.error('Błąd przy pobieraniu klas nauczyciela:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getClasses,
  createClass,
  deleteClass,
  getStudentsInClass,
  getClassesByTeacherId
};
