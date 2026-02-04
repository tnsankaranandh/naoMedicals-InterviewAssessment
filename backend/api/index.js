require('dotenv').config();
const serverless = require('serverless-http');
const app = require('../src/app');
const connectDB = require('../src/config/db');

// Ensure DB is connected before handling requests
(async () => {
  try {
    await connectDB();
  } catch (err) {
    console.error('Failed to connect to database:', err);
  }
})();

module.exports = serverless(app);
