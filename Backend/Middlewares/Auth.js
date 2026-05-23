const jwt = require("jsonwebtoken");
const User = require("../Models/User");
require("dotenv").config();

// Middleware to authenticate the user using JWT token
exports.auth = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token ||
      req.body?.token ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is missing",
      });
    }

    // verify the token
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decode;

      // Find user in database to check status dynamically
      const user = await User.findById(decode.id);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found or session is invalid",
        });
      }

      if (user.status === "Inactive") {
        return res.status(403).json({
          success: false,
          message: "Your account is deactivated. Please contact an admin.",
        });
      }

      // Set user details for downstream handlers
      req.userDetails = user;
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while validating the token",
    });
  }
};

// Middleware to allow only Admins
exports.isAdmin = async (req, res, next) => {
  try {
    // Check role in database user details
    const role = req.userDetails?.role || req.user?.role || req.user?.accountType;
    
    if (role !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied: Admins only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error verifying admin access",
    });
  }
};
