const { MongoClient } = require('mongodb');
require('dotenv').config();

const client = new MongoClient(process.env.MONGO_URI);

async function connectMongo() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db(process.env.MONGO_DB_NAME);
  } catch (err) {
    console.error('MongoDB connection failed', err);
    process.exit(1);
  }
}

module.exports = connectMongo;