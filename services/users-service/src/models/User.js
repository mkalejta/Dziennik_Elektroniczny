const { ObjectId } = require('mongodb');

class User {
  constructor({ _id = new ObjectId(), name, surname, role, createdAt = new Date() }) {
    this._id = _id;
    this.name = name;
    this.surname = surname;
    this.role = role; // 'admin' or 'student' or 'teacher' or 'parent'
    this.createdAt = createdAt;
  }

  static validate(user) {
    if (!user.name || typeof user.name !== 'string') {
      throw new Error('Invalid or missing "name"');
    }
    if (!user.role || typeof user.role !== 'string') {
      throw new Error('Invalid or missing "role"');
    }
    return true;
  }
}

module.exports = User;