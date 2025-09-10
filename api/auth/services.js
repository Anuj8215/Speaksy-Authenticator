const speakeasy = require("speakeasy");
const connectDb = require("../../lib/db");
const auth = require("../../lib/auth");
const cors = require("../../lib/cors");

/**
 * @route   GET /api/auth/services
 * @desc    Get all services with current TOTP codes
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

    const services = user.services.map((svc) => {
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
}