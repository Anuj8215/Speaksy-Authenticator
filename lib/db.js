const mongoose = require("mongoose");

let isConnected = false;

async function connectDb() {
  if (isConnected) {
    return;
  }

  try {
    // Set strictQuery to false to prepare for Mongoose 7 changes
    mongoose.set("strictQuery", false);

    // Connect with updated options for MongoDB connection
    await mongoose.connect(process.env.MONGO_URI, {
      // These options help with connection stability in serverless environment
      serverSelectionTimeoutMS: 5000, // Reduce timeout for serverless
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      maxPoolSize: 10, // Maintain up to 10 socket connections
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0, // Disable mongoose buffering
    });

    isConnected = true;
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
}

module.exports = connectDb;