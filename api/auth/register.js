const bcrypt = require("bcryptjs");
const connectDb = require("../../lib/db");
const { User } = require("../../lib/models");
const cors = require("../../lib/cors");

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
export default async function handler(req, res) {
  // Handle CORS
  if (cors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDb();

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
}