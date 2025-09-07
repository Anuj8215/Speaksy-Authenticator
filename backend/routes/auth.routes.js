const express = require("express");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const User = require("../models/User");

const router = express.Router();

//NOTE - Register a new user
router.post("/register", async (req, res) => {
  try {
    const { username } = req.body;

    let user = await User.findOne({ username });
    if (user) return res.status(400).json({ error: "User already exists" });

    user = new User({ username, services: [] });
    await user.save();

    res.json({ message: "User registered successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

//NOTE - Add a new service for a user
router.post("/add-service", async (req, res) => {
  try {
    const { username, serviceName } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    const secret = speakeasy.generateSecret({
      name: `${serviceName} (${username})`,
    });

    user.services.push({ name: serviceName, secret: secret.base32 });
    await user.save();

    const qrDataUrl = await qrcode.toDataURL(secret.otpauth_url);

    res.json({
      message: "Service added",
      service: {
        name: serviceName,
        secret: secret.base32,
        qrDataUrl,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

//NOTE - Get current TOTP codes for all services of a user
router.get("/totp/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    const codes = user.services.map((svc) => ({
      name: svc.name,
      code: speakeasy.totp({
        secret: svc.secret,
        encoding: "base32",
      }),
    }));

    res.json({ username, codes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

//NOTE - Verify TOTP code for a service
router.post("/verify", async (req, res) => {
  try {
    const { username, serviceName, token } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    const svc = user.services.find((s) => s.name === serviceName);
    if (!svc) return res.status(404).json({ error: "Service not found" });

    const verified = speakeasy.totp.verify({
      secret: svc.secret,
      encoding: "base32",
      token,
      window: 1, // allow 30s before/after
    });

    res.json({ verified });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
