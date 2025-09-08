const mongoose = require("mongoose");

async function connectDb(uri) {
  try {
    // Set strictQuery to false to prepare for Mongoose 7 changes
    mongoose.set("strictQuery", false);

    // Connect with updated options for MongoDB connection
    await mongoose.connect(uri, {
      // These options help with connection stability
      serverSelectionTimeoutMS: 10000, // Increase timeout to 10 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });

    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    // Don't exit process in case of connection error - allow retries
    // process.exit(1);
  }
}

// Handle connection events
mongoose.connection.on("error", (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

mongoose.connection.on("reconnected", () => {
  console.log("MongoDB reconnected");
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed due to app termination");
  process.exit(0);
});

module.exports = connectDb;
