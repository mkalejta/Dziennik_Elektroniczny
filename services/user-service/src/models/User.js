const { ObjectId } = require('mongodb');

class User {
  constructor({ _id = new ObjectId(), name, email, role, createdAt = new Date() }) {
    this._id = _id;
    this.name = name;
    this.email = email;
    this.role = role;
    this.createdAt = createdAt;
  }

  static validate(user) {
    if (!user.name || typeof user.name !== 'string') {
      throw new Error('Invalid or missing "name"');
    }
    if (!user.email || typeof user.email !== 'string') {
      throw new Error('Invalid or missing "email"');
    }
    if (!user.role || typeof user.role !== 'string') {
      throw new Error('Invalid or missing "role"');
    }
    return true;
  }
}

module.exports = User;