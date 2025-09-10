const connectDb = require("../../lib/db");
const auth = require("../../lib/auth");
const cors = require("../../lib/cors");

/**
 * @route   GET /api/auth/user
 * @desc    Get current user info
 * @access  Private
 */
export default async function handler(req, res) {
  // Handle CORS
  if (cors(req, res)) return;

  if (req.method !== 'GET') {
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

    res.json({
      user: {
        id: user._id,
        username: user.username,
        serviceCount: user.services.length,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}