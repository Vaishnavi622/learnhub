const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "learnhub_super_secret_key_12345";

// ==================================================
// REGISTER USER
// POST /api/auth/register
// ==================================================
const registerUser = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    const displayName = (name || username || "").trim();
    const cleanEmail = (email || "").trim().toLowerCase();

    // Required fields check
    if (!displayName || !cleanEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required."
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address."
      });
    }

    // Password validation (at least 6 characters, frontend recommends 8)
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long."
      });
    }

    // Check if email already exists
    const checkQuery = "SELECT id, email FROM users WHERE email = ?";

    db.query(checkQuery, [cleanEmail], async (checkErr, existingUsers) => {
      if (checkErr) {
        console.error("[Auth] Database check error:", checkErr);
        return res.status(500).json({
          success: false,
          message: "Database error during registration.",
          error: checkErr.message
        });
      }

      if (existingUsers && existingUsers.length > 0) {
        return res.status(409).json({
          success: false,
          message: "Email is already registered. Please login instead."
        });
      }

      try {
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Determine initial role
        const role = cleanEmail.includes("admin") ? "admin" : "student";

        // Insert new user
        const insertQuery = `
          INSERT INTO users (name, email, password, role)
          VALUES (?, ?, ?, ?)
        `;

        db.query(insertQuery, [displayName, cleanEmail, hashedPassword, role], (insertErr, result) => {
          if (insertErr) {
            console.error("[Auth] Insert user error:", insertErr);
            return res.status(500).json({
              success: false,
              message: "Failed to create user account.",
              error: insertErr.message
            });
          }

          const userId = result.insertId || Date.now();

          // Generate JWT Token
          const token = jwt.sign(
            { id: userId, email: cleanEmail, role },
            JWT_SECRET,
            { expiresIn: "7d" }
          );

          return res.status(201).json({
            success: true,
            message: "User registered successfully!",
            token,
            user: {
              id: userId,
              name: displayName,
              username: displayName,
              email: cleanEmail,
              role
            }
          });
        });
      } catch (hashError) {
        console.error("[Auth] Password hash error:", hashError);
        return res.status(500).json({
          success: false,
          message: "Error processing password.",
          error: hashError.message
        });
      }
    });
  } catch (error) {
    console.error("[Auth] Register server error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during registration.",
      error: error.message
    });
  }
};

// ==================================================
// LOGIN USER
// POST /api/auth/login
// ==================================================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const cleanEmail = (email || "").trim().toLowerCase();

    if (!cleanEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required."
      });
    }

    const query = "SELECT * FROM users WHERE email = ?";

    db.query(query, [cleanEmail], async (err, results) => {
      if (err) {
        console.error("[Auth] Login database error:", err);
        return res.status(500).json({
          success: false,
          message: "Database error during login.",
          error: err.message
        });
      }

      if (!results || results.length === 0) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password."
        });
      }

      const user = results[0];

      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password."
        });
      }

      const displayName = user.name || user.username || cleanEmail.split("@")[0];
      const role = user.role || "student";

      // Generate JWT Token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role
        },
        JWT_SECRET,
        {
          expiresIn: "7d"
        }
      );

      return res.status(200).json({
        success: true,
        message: "Login successful!",
        token,
        user: {
          id: user.id,
          name: displayName,
          username: displayName,
          email: user.email,
          role
        }
      });
    });
  } catch (error) {
    console.error("[Auth] Login server error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during login.",
      error: error.message
    });
  }
};

// ==================================================
// GET CURRENT USER PROFILE
// GET /api/auth/me
// ==================================================
const getMe = async (req, res) => {
  try {
    const userId = req.user.id;

    const query = "SELECT id, name, username, email, role, created_at FROM users WHERE id = ?";

    db.query(query, [userId], (err, results) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Database error fetching user profile."
        });
      }

      if (!results || results.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found."
        });
      }

      const user = results[0];
      return res.status(200).json({
        success: true,
        user: {
          id: user.id,
          name: user.name || user.username,
          username: user.username || user.name,
          email: user.email,
          role: user.role,
          created_at: user.created_at
        }
      });
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error fetching user profile."
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe
};