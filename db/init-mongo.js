db = db.getSiblingDB('gradebookDB');

// USERS COLLECTION
db.createCollection('users');
db.users.insertOne({
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'admin',
  password: 'admin123',
  createdAt: new Date(),
});

// ATTENDANCE COLLECTION
db.createCollection('attendance');

// MESSAGES COLLECTION
db.createCollection('messages');
