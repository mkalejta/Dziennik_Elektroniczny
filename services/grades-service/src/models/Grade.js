const { ObjectId } = require('mongodb');

class Grade {
  constructor({ _id = new ObjectId(), studentId, subjectId, teacherId, grade, createdAt = new Date() }) {
    this._id = _id;
    this.studentId = studentId;
    this.subjectId = subjectId;
    this.teacherId = teacherId;
    this.grade = grade;
    this.createdAt = createdAt;
  }

  static validate(grade) {
    if (!grade.studentId || typeof grade.studentId !== 'string') {
      throw new Error('Invalid or missing "studentId"');
    }
    if (!grade.subjectId || typeof grade.subjectId !== 'string') {
      throw new Error('Invalid or missing "subjectId"');
    }
    if (!grade.teacherId || typeof grade.teacherId !== 'string') {
      throw new Error('Invalid or missing "teacherId"');
    }
    if (grade.grade === undefined || typeof grade.grade !== 'number') {
      throw new Error('Invalid or missing "grade"');
    }
    if (grade.grade < 1 || grade.grade > 6) {
      throw new Error('Grade must be between 1 and 6');
    }
    return true;
  }
}

module.exports = Grade;