const { ObjectId } = require('mongodb');

class Class {
  constructor({ _id }) {
    this._id = new ObjectId(_id);
    this.name = _id;
  }

  static validate(class_instance) {
    if (!class_instance._id) {
      throw new Error('Class ID is required');
    }
    if (typeof class_instance._id !== 'string') {
      throw new Error('Class ID must be a string');
    }
    if (!/^[1-8]{1}[A-F]{1}$/.test(class_instance._id)) {
      throw new Error('Class ID must consist of 1 number and 1 uppercase letter');
    }
    return true;
  }
}

module.exports = Class;