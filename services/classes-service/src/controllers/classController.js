const pgClient = require('../db/pgClient');
const connectMongo = require('../db/mongoClient');
const { ObjectId } = require('mongodb');

async function getStudentsInClass(req, res) {
  const classId = req.params.classId;

  try {
    const result = await pgClient.query(
      'SELECT student_id FROM students_assignments WHERE class_id = $1',
      [classId]
    );

    const studentIds = result.rows.map(row => row.student_id);

    if (studentIds.length === 0) {
      return res.json([]);
    }

    const db = await connectMongo();
    const usersCollection = db.collection('users');

    const objectIds = studentIds.map(id => new ObjectId(id));

    const students = await usersCollection
      .find({ _id: { $in: objectIds }, role: 'student' })
      .project({ password: 0 }) // nie zwracam haseł
      .toArray();

    res.json(students);
  } catch (error) {
    console.error('Błąd przy pobieraniu uczniów z klasy:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getStudentsInClass,
};
