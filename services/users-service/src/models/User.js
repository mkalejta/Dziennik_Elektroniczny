const { ObjectId } = require('mongodb');

class User {
  constructor({ _id = new ObjectId(), name, email, role, password, createdAt = new Date() }) {
    this._id = _id;
    this.name = name;
    this.email = email;
    this.role = role;
    this.password = password;
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
    if (!user.password || typeof user.password !== 'string') {
      throw new Error('Invalid or missing "password"');
    }
    if (user.password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
    return true;
  }
}

module.exports = User;