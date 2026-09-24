const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getMe } = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");

// =====================================================
// AUTH ROUTES
// =====================================================

// POST /api/auth/register
router.post("/register", registerUser);

// POST /api/auth/login
router.post("/login", loginUser);

// GET /api/auth/me (Protected)
router.get("/me", verifyToken, getMe);

// GET /api/auth/profile (Protected alias)
router.get("/profile", verifyToken, getMe);

module.exports = router;