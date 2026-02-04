const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  // Return cached connection if already connected
  if (isConnected) {
    console.log("Using cached MongoDB connection");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10,
      minPoolSize: 2,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
      maxIdleTimeMS: 60000,
    });
    isConnected = true;
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed", err);
    isConnected = false;
    throw err; // Throw instead of process.exit for serverless
  }
};

module.exports = connectDB;
