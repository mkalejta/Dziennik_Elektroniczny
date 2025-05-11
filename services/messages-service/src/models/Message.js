const { ObjectId } = require('mongodb');

class Message {
  constructor({ 
    _id = new ObjectId(), 
    teacherId,
    personId, 
    messages = [] 
  }) {
    this._id = _id;
    this.teacherId = teacherId;
    this.personId = personId;
    this.messages = messages;
  }

  static validate(message) {
    if (!message.teacherId || typeof message.teacherId !== 'string') {
      throw new Error('Invalid or missing "teacherId"');
    }
    if (!message.personId || typeof message.personId !== 'string') {
      throw new Error('Invalid or missing "personId"');
    }
    return true;
  }
}

module.exports = Message;