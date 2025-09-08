const express = require("express");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth.middleware");

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields" });
    }

    // Check if user exists
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    user = new User({
      username,
      password: hashedPassword,
      services: [],
    });

    await user.save();

    // Don't generate or return JWT token after registration
    // Just return success message
    res.status(201).json({
      message: "Registration successful",
      user: { username: user.username },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user and get token
 * @access  Public
 */
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields" });
    }

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, user: { username: user.username } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * @route   POST /api/auth/register-service
 * @desc    Register a new service with manual secret entry
 * @access  Private
 */
router.post("/register-service", auth, async (req, res) => {
  try {
    const { name, secret, issuer } = req.body;

    // Validate input
    if (!name || !secret) {
      return res
        .status(400)
        .json({ error: "Please provide service name and secret code" });
    }

    // Validate secret format (base32)
    try {
      speakeasy.totp({
        secret: secret,
        encoding: "base32",
      });
    } catch (err) {
      return res.status(400).json({ error: "Invalid secret code format" });
    }

    // Add service to user
    req.user.services.push({
      name,
      secret,
      issuer: issuer || "",
    });

    await req.user.save();
    res.json({ message: "Service added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * @route   POST /api/auth/register-service-scan
 * @desc    Register a new service from scanned QR code
 * @access  Private
 */
router.post("/register-service-scan", auth, async (req, res) => {
  try {
    const { otpauth_url } = req.body;

    if (!otpauth_url) {
      return res.status(400).json({ error: "Invalid OTP auth URL" });
    }

    // Parse the OTP auth URL
    const parsed = speakeasy.otpauthURL.parse(otpauth_url);

    if (!parsed.secret) {
      return res.status(400).json({ error: "Invalid OTP auth URL format" });
    }

    // Add service to user
    req.user.services.push({
      name: parsed.label || "Unnamed Service",
      secret: parsed.secret.base32,
      issuer: parsed.issuer || "",
      algorithm: parsed.algorithm || "SHA1",
      digits: parsed.digits || 6,
      period: parsed.period || 30,
    });

    await req.user.save();
    res.json({ message: "Service added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * @route   GET /api/auth/services
 * @desc    Get all services with current TOTP codes
 * @access  Private
 */
router.get("/services", auth, async (req, res) => {
  try {
    const services = req.user.services.map((svc) => {
      // Generate current TOTP code
      const code = speakeasy.totp({
        secret: svc.secret,
        encoding: "base32",
        algorithm: svc.algorithm,
        digits: svc.digits,
        period: svc.period,
      });

      // Calculate time remaining
      const epoch = Math.floor(Date.now() / 1000);
      const timeRemaining = svc.period - (epoch % svc.period);

      return {
        id: svc._id,
        name: svc.name,
        issuer: svc.issuer,
        code,
        timeRemaining,
      };
    });

    res.json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * @route   DELETE /api/auth/services/:id
 * @desc    Delete a service
 * @access  Private
 */
router.delete("/services/:id", auth, async (req, res) => {
  try {
    const serviceIndex = req.user.services.findIndex(
      (svc) => svc._id.toString() === req.params.id
    );

    if (serviceIndex === -1) {
      return res.status(404).json({ error: "Service not found" });
    }

    req.user.services.splice(serviceIndex, 1);
    await req.user.save();

    res.json({ message: "Service deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * @route   POST /api/auth/verify
 * @desc    Verify a TOTP code for a service
 * @access  Private
 */
router.post("/verify", auth, async (req, res) => {
  try {
    const { serviceId, token } = req.body;

    const service = req.user.services.id(serviceId);
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    const verified = speakeasy.totp.verify({
      secret: service.secret,
      encoding: "base32",
      token,
      window: 1, // Allow 1 step before/after (30s window each side)
      algorithm: service.algorithm,
      digits: service.digits,
      period: service.period,
    });

    res.json({ verified });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * @route   GET /api/auth/user
 * @desc    Get current user info
 * @access  Private
 */
router.get("/user", auth, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        username: req.user.username,
        serviceCount: req.user.services.length,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
