const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  secret: { type: String, required: true },
  issuer: { type: String, default: "" }, // Service provider name
  type: { type: String, default: "totp" },
  algorithm: { type: String, default: "SHA1" },
  digits: { type: Number, default: 6 },
  period: { type: Number, default: 30 },
});

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    services: [serviceSchema],
  },
  {
    timestamps: true,
  }
);

// Use existing model if already compiled, otherwise create new one
const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = { User };