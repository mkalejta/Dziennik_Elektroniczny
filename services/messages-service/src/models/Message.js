const { ObjectId } = require('mongodb');

class Message {
  constructor({ 
    _id = new ObjectId(), 
    teacherId, 
    studentId, 
    messages = [] 
  }) {
    this._id = _id;
    this.teacherId = teacherId;
    this.studentId = studentId;
    this.messages = messages;
  }

  static validate(message) {
    if (!message.teacherId || !(message.teacherId instanceof ObjectId)) {
      throw new Error('Invalid or missing "teacherId"');
    }
    if (!message.studentId || !(message.studentId instanceof ObjectId)) {
      throw new Error('Invalid or missing "studentId"');
    }
    if (
      !Array.isArray(message.messages) || 
      !message.messages.every(msg => 
        msg.author instanceof ObjectId && 
        typeof msg.content === 'string' && 
        !isNaN(Date.parse(msg.sent))
      )
    ) {
      throw new Error('Invalid or missing "messages" (must be an array of objects with "author", "content", and "sent")');
    }
    return true;
  }
}

module.exports = Message;