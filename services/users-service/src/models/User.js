const { ObjectId } = require('mongodb');

class User {
  constructor({ _id = new ObjectId(), name, surname, role }) {
    this._id = _id;
    this.name = name;
    this.surname = surname;
    this.role = role; // 'admin' or 'student' or 'teacher' or 'parent'
  }

  static validate(user) {
    if (!user) {
      throw new Error('User object is required');
    }
    if (!user._id || !(user._id instanceof ObjectId)) {
      throw new Error('Invalid or missing "_id"');
    }
    if (!user.name || typeof user.name !== 'string') {
      throw new Error('Invalid or missing "name"');
    }
    if (!user.surname || typeof user.surname !== 'string') {
      throw new Error('Invalid or missing "surname"');
    }
    if (!user.role || typeof user.role !== 'string') {
      throw new Error('Invalid or missing "role"');
    }
    if (!['admin', 'student', 'teacher', 'parent'].includes(user.role)) {
      throw new Error('Invalid "role" value');
    }

    return true;
  }
}

module.exports = User;