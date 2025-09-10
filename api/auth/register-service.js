const connectDb = require("../../lib/db");
const auth = require("../../lib/auth");
const cors = require("../../lib/cors");

/**
 * @route   POST /api/auth/register-service
 * @desc    Register a new TOTP service
 * @access  Private
 */
export default async function handler(req, res) {
  // Handle CORS
  if (cors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDb();

    // Authenticate user
    const authResult = await auth(req, res);
    if (authResult.error) {
      return res.status(authResult.status).json({ error: authResult.error });
    }

    const { user } = authResult;
    const { name, secret, issuer = "" } = req.body;

    // Validate input
    if (!name || !secret) {
      return res
        .status(400)
        .json({ error: "Please provide service name and secret" });
    }

    // Add service to user
    user.services.push({
      name,
      secret,
      issuer,
      algorithm: "SHA1",
      digits: 6,
      period: 30,
    });

    await user.save();
    res.json({ message: "Service added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}