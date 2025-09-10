const connectDb = require("../../../lib/db");
const auth = require("../../../lib/auth");
const cors = require("../../../lib/cors");

/**
 * @route   DELETE /api/auth/services/[id]
 * @desc    Delete a service
 * @access  Private
 */
export default async function handler(req, res) {
  // Handle CORS
  if (cors(req, res)) return;

  if (req.method !== 'DELETE') {
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
    const { id } = req.query;

    const serviceIndex = user.services.findIndex(
      (svc) => svc._id.toString() === id
    );

    if (serviceIndex === -1) {
      return res.status(404).json({ error: "Service not found" });
    }

    user.services.splice(serviceIndex, 1);
    await user.save();

    res.json({ message: "Service deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}