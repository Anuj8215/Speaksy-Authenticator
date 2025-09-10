const speakeasy = require("speakeasy");
const connectDb = require("../../lib/db");
const auth = require("../../lib/auth");
const cors = require("../../lib/cors");

/**
 * @route   POST /api/auth/verify
 * @desc    Verify a TOTP code for a service
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
    const { serviceId, token } = req.body;

    const service = user.services.id(serviceId);
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
}