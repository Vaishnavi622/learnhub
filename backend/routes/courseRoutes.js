const express = require("express");
const router = express.Router();
const {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
} = require("../controllers/courseController");
const { verifyToken, isAdmin, optionalAuth } = require("../middleware/authMiddleware");

// =====================================================
// COURSE ROUTES
// =====================================================

// GET /api/courses - List all courses with optional filters
router.get("/", getAllCourses);

// GET /api/courses/:id - Get course details
router.get("/:id", getCourseById);

// POST /api/courses - Create new course (protected)
router.post("/", optionalAuth, createCourse);

// PUT /api/courses/:id - Update course
router.put("/:id", optionalAuth, updateCourse);

// DELETE /api/courses/:id - Delete course
router.delete("/:id", optionalAuth, deleteCourse);

module.exports = router;
