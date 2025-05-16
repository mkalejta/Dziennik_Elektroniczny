const { ObjectId } = require('mongodb');

class Attendance {
    constructor({ _id = new ObjectId(), teacherId, students = [], date = new Date(), subjectId }) {
        this._id = _id;
        this.teacherId = teacherId;
        this.students = students; // Lista obiektów { id, name, surname, present }
        this.date = date;
        this.subjectId = subjectId;
    }

    static validate(attendance) {
        if (!attendance.teacherId || typeof attendance.teacherId !== 'string') {
            throw new Error('Invalid or missing "teacherId"');
        }
        if (
            !Array.isArray(attendance.students) ||
            !attendance.students.every(
                (student) =>
                    typeof student.id === 'string' &&
                    typeof student.name === 'string' &&
                    typeof student.surname === 'string' &&
                    typeof student.present === 'boolean'
            )
        ) {
            throw new Error(
                'Invalid or missing "students" (must be an array of objects with fields { id, name, surname, present })'
            );
        }
        if (!attendance.subjectId || typeof attendance.subjectId !== 'string') {
            throw new Error('Invalid or missing "subjectId"');
        }
        return true;
    }
}

module.exports = Attendance;