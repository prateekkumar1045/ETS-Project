import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header
    if (!token) {
      return res.status(401).json({ success: false, error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY); // Decode the token
    const user = await User.findById(decoded._id); // Find the user by ID
    if (!user) {
      return res.status(401).json({ success: false, error: "User not found" });
    }

    req.user = user; // Attach the user object to the request
    console.log("Authenticated user ID:", user._id); // Log the user ID for debugging
    next(); // Proceed to the next middleware or controller
  } catch (error) {
    console.error("Authentication failed:", error); // Log authentication errors
    return res.status(500).json({ success: false, error: "Authentication failed" });
  }
};

export default authMiddleware;