const { ObjectId } = require('mongodb');

class Message {
  constructor({ 
    _id = new ObjectId(), 
    teacherId, 
    parentId, 
    messages = [] 
  }) {
    this._id = _id;
    this.teacherId = teacherId;
    this.parentId = parentId;
    this.messages = messages;
  }

  static validate(message) {
    if (!message.teacherId || typeof message.teacherId !== 'string') {
      throw new Error('Invalid or missing "teacherId"');
    }
    if (!message.parentId || typeof message.parentId !== 'string') {
      throw new Error('Invalid or missing "parentId"');
    }
    return true;
  }
}

module.exports = Message;