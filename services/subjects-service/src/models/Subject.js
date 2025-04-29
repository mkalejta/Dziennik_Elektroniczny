const { ObjectId } = require('mongodb');

class Subject {
  constructor({ _id = new ObjectId(), name, classId, teacherId, createdAt = new Date() }) {
    this._id = _id;
    this.name = name;
    this.classId = classId;
    this.teacherId = teacherId;
    this.createdAt = createdAt;
  }

  static validate(subject) {
    if (!subject.name || typeof subject.name !== 'string') {
      throw new Error('Invalid or missing "name"');
    }
    if (!subject.classId || typeof subject.classId !== 'string') {
      throw new Error('Invalid or missing "classId"');
    }
    if (!subject.teacherId || typeof subject.teacherId !== 'string') {
      throw new Error('Invalid or missing "teacherId"');
    }
    return true;
  }
}

module.exports = Subject;