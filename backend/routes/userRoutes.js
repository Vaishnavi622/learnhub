const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  getUserEnrollments,
  enrollInCourse,
  updateProgress,
  getAdminStats
} = require("../controllers/userController");
const { verifyToken, optionalAuth } = require("../middleware/authMiddleware");

// =====================================================
// USER & ENROLLMENT ROUTES
// =====================================================

// GET /api/users/profile - Get profile (with token or ?userId=)
router.get("/profile", optionalAuth, getUserProfile);

// GET /api/users/enrolled - Get user enrolled courses
router.get("/enrolled", optionalAuth, getUserEnrollments);

// POST /api/users/enroll - Enroll in course
router.post("/enroll", optionalAuth, enrollInCourse);

// POST /api/users/progress - Update progress
router.post("/progress", optionalAuth, updateProgress);

// GET /api/users/stats - Admin/learning statistics
router.get("/stats", getAdminStats);

module.exports = router;
