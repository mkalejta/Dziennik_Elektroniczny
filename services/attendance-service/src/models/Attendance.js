const { ObjectId } = require('mongodb');

class Attendance {
    constructor({ _id = new ObjectId(), teacherId, students = [], date = new Date(), subjectId }) {
        this._id = _id;
        this.teacherId = teacherId;
        this.students = students;
        this.date = date;
        this.subjectId = subjectId;
    }

    static validate(attendance) {
        if (!attendance.teacherId || !(attendance.teacherId instanceof ObjectId)) {
            throw new Error('Invalid or missing "teacherId"');
        }
        if (
            !Array.isArray(attendance.students) ||
            !attendance.students.every(student =>
                student.studentId instanceof ObjectId && typeof student.present === 'boolean'
            )
        ) {
            throw new Error('Invalid or missing "students" (must be an array of objects with "studentId" and "present")');
        }
        if (!attendance.date || isNaN(Date.parse(attendance.date))) {
            throw new Error('Invalid or missing "date"');
        }
        if (!attendance.subjectId || typeof attendance.subjectId !== 'string') {
            throw new Error('Invalid or missing "subjectId"');
        }
        return true;
    }
}

module.exports = Attendance;