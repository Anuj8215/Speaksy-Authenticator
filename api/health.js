const cors = require("../lib/cors");

/**
 * @route   GET /api/health
 * @desc    Health check endpoint
 * @access  Public
 */
export default async function handler(req, res) {
  // Handle CORS
  if (cors(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.json({ 
    status: "ok", 
    message: "Server is running",
    timestamp: new Date().toISOString()
  });
}