const jwt = require("jsonwebtoken");
const { User } = require("./models");

const auth = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return { error: "Please authenticate", status: 401 };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return { error: "Please authenticate", status: 401 };
    }

    return { user };
  } catch (error) {
    return { error: "Please authenticate", status: 401 };
  }
};

module.exports = auth;