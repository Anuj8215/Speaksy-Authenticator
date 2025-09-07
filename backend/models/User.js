const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  secret: { type: String, required: true },
});

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    services: [serviceSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
