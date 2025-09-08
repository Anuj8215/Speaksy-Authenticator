require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDb = require("./utils/db");
const authRoutes = require("./routes/auth.routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Health check route
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Connect to MongoDB
connectDb(process.env.MONGO_URI);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
});
