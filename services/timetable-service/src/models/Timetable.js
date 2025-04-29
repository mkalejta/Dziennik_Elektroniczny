const { ObjectId } = require('mongodb');

class Timetable {
  constructor({ 
    _id = new ObjectId(), 
    classId, 
    subjectId, 
    teacherId, 
    day, 
    startAt, 
    finishAt 
  }) {
    this._id = _id;
    this.classId = classId;
    this.subjectId = subjectId;
    this.teacherId = teacherId;
    this.day = day;
    this.startAt = startAt;
    this.finishAt = finishAt;
  }

  static validate(timetable) {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // Format HH:mm

    if (!timetable.classId || typeof timetable.classId !== 'string') {
      throw new Error('Invalid or missing "classId"');
    }
    if (!timetable.subjectId || typeof timetable.subjectId !== 'string') {
      throw new Error('Invalid or missing "subjectId"');
    }
    if (!timetable.teacherId || typeof timetable.teacherId !== 'string') {
      throw new Error('Invalid or missing "teacherId"');
    }
    if (!timetable.day || typeof timetable.day !== 'string') {
      throw new Error('Invalid or missing "day"');
    }
    if (!timetable.startAt || !timeRegex.test(timetable.startAt)) {
      throw new Error('Invalid or missing "startAt" (must be in HH:mm format)');
    }
    if (!timetable.finishAt || !timeRegex.test(timetable.finishAt)) {
      throw new Error('Invalid or missing "finishAt" (must be in HH:mm format)');
    }
    return true;
  }
}

module.exports = Timetable;