const speakeasy = require("speakeasy");
const connectDb = require("../../lib/db");
const auth = require("../../lib/auth");
const cors = require("../../lib/cors");

/**
 * @route   POST /api/auth/register-service-scan
 * @desc    Register a service via OTP URL (QR code scan)
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
    const { otpauth_url } = req.body;

    if (!otpauth_url) {
      return res.status(400).json({ error: "OTP auth URL is required" });
    }

    // Parse the OTP auth URL
    const parsed = speakeasy.otpauthURL.parse(otpauth_url);

    if (!parsed.secret) {
      return res.status(400).json({ error: "Invalid OTP auth URL format" });
    }

    // Add service to user
    user.services.push({
      name: parsed.label || "Unnamed Service",
      secret: parsed.secret.base32,
      issuer: parsed.issuer || "",
      algorithm: parsed.algorithm || "SHA1",
      digits: parsed.digits || 6,
      period: parsed.period || 30,
    });

    await user.save();
    res.json({ message: "Service added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}