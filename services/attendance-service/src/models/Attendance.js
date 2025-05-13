const { ObjectId } = require('mongodb');

class Attendance {
    constructor({ _id = new ObjectId(), teacherId, students = {}, date = new Date(), subjectId }) {
        this._id = _id;
        this.teacherId = teacherId;
        this.students = students; // Obiekt { studentId: true/false }
        this.date = date;
        this.subjectId = subjectId;
    }

    static validate(attendance) {
        if (!attendance.teacherId || typeof attendance.teacherId !== 'string') {
            throw new Error('Invalid or missing "teacherId"');
        }
        if (
            typeof attendance.students !== 'object' ||
            !Object.values(attendance.students).every(value => typeof value === 'boolean')
        ) {
            throw new Error('Invalid or missing "students" (must be an object with boolean values)');
        }
        if (!attendance.subjectId || typeof attendance.subjectId !== 'string') {
            throw new Error('Invalid or missing "subjectId"');
        }
        return true;
    }
}

module.exports = Attendance;