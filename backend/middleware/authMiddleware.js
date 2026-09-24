const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "learnhub_super_secret_key_12345";

/**
 * Verify JWT Token Middleware
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"] || req.headers["x-access-token"];

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Access token is required."
    });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : authHeader.trim();

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Invalid token format."
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "Invalid or expired token."
      });
    }

    req.user = decoded;
    next();
  });
};

/**
 * Admin Only Middleware
 */
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required."
    });
  }
  next();
};

/**
 * Optional Authentication Middleware
 */
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"] || req.headers["x-access-token"];
  if (!authHeader) {
    return next();
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : authHeader.trim();

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (!err && decoded) {
      req.user = decoded;
    }
    next();
  });
};

module.exports = {
  verifyToken,
  isAdmin,
  optionalAuth
};
