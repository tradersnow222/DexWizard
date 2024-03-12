const { MongoClient } = require('mongodb');
require('dotenv').config(); 
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;

const uri = process.env.MONGODB_URI; 
const dbName = process.env.MONGODB_DB_NAME; 
let db;

const connectDB = async () => {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
    console.log("Connected successfully to MongoDB");
  } catch (e) {
    console.error("Could not connect to MongoDB", e);
  }
};

const getDB = () => {
  if (!db) {
    throw 'Database not initialized';
  }
  return db;
};

module.exports = { connectDB, getDB };
