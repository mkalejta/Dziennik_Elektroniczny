db = db.getSiblingDB('usersdb');

// Create a 'users' collection and insert an initial user
db.createCollection('users');
db.users.insertOne({
  name: 'Admin',
  email: 'admin@example.com',
  role: 'admin',
  createdAt: new Date(),
});