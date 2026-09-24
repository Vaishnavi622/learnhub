const db = require("../config/db");

// ==================================================
// GET ALL COURSES (with optional search & filters)
// GET /api/courses
// ==================================================
const getAllCourses = async (req, res) => {
  try {
    const { search = "", category = "All", level = "All" } = req.query;

    const sql = "SELECT * FROM courses ORDER BY id ASC";

    db.query(sql, (err, courses) => {
      if (err) {
        console.error("[Courses] Database error:", err);
        return res.status(500).json({
          success: false,
          message: "Database error fetching courses.",
          error: err.message
        });
      }

      let filtered = courses || [];

      // Filter by search
      if (search && search.trim() !== "") {
        const query = search.trim().toLowerCase();
        filtered = filtered.filter(c =>
          (c.title && c.title.toLowerCase().includes(query)) ||
          (c.description && c.description.toLowerCase().includes(query)) ||
          (c.instructor && c.instructor.toLowerCase().includes(query))
        );
      }

      // Filter by category
      if (category && category !== "All") {
        filtered = filtered.filter(c => c.category && c.category.toLowerCase() === category.toLowerCase());
      }

      // Filter by level
      if (level && level !== "All") {
        filtered = filtered.filter(c => c.level && c.level.toLowerCase() === level.toLowerCase());
      }

      return res.status(200).json({
        success: true,
        count: filtered.length,
        courses: filtered
      });
    });
  } catch (error) {
    console.error("[Courses] Server error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching courses.",
      error: error.message
    });
  }
};

// ==================================================
// GET COURSE BY ID
// GET /api/courses/:id
// ==================================================
const getCourseById = async (req, res) => {
  try {
    const courseId = Number(req.params.id);

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID."
      });
    }

    const sql = "SELECT * FROM courses WHERE id = ?";

    db.query(sql, [courseId], (err, results) => {
      if (err) {
        console.error("[Courses] Error fetching course:", err);
        return res.status(500).json({
          success: false,
          message: "Database error fetching course.",
          error: err.message
        });
      }

      if (!results || results.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Course not found."
        });
      }

      return res.status(200).json({
        success: true,
        course: results[0]
      });
    });
  } catch (error) {
    console.error("[Courses] Server error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching course details.",
      error: error.message
    });
  }
};

// ==================================================
// CREATE NEW COURSE
// POST /api/courses
// ==================================================
const createCourse = async (req, res) => {
  try {
    const {
      title,
      instructor = "LearnHub",
      category = "General",
      level = "Beginner",
      rating = 4.8,
      students = 0,
      duration = "10 hours",
      lessons = 20,
      description = ""
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Course title is required."
      });
    }

    const sql = `
      INSERT INTO courses (title, instructor, category, level, rating, students, duration, lessons, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [title, instructor, category, level, rating, students, duration, lessons, description],
      (err, result) => {
        if (err) {
          console.error("[Courses] Error creating course:", err);
          return res.status(500).json({
            success: false,
            message: "Failed to create course.",
            error: err.message
          });
        }

        const newId = result.insertId || Date.now();

        return res.status(201).json({
          success: true,
          message: "Course created successfully!",
          course: {
            id: newId,
            title,
            instructor,
            category,
            level,
            rating,
            students,
            duration,
            lessons,
            description
          }
        });
      }
    );
  } catch (error) {
    console.error("[Courses] Error in createCourse:", error);
    return res.status(500).json({
      success: false,
      message: "Server error creating course.",
      error: error.message
    });
  }
};

// ==================================================
// UPDATE COURSE
// PUT /api/courses/:id
// ==================================================
const updateCourse = async (req, res) => {
  try {
    const courseId = Number(req.params.id);
    const { title, instructor, category, level, rating, students, duration, lessons, description } = req.body;

    const findSql = "SELECT * FROM courses WHERE id = ?";

    db.query(findSql, [courseId], (err, results) => {
      if (err || !results || results.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Course not found."
        });
      }

      const existing = results[0];
      const updated = {
        title: title || existing.title,
        instructor: instructor || existing.instructor,
        category: category || existing.category,
        level: level || existing.level,
        rating: rating !== undefined ? rating : existing.rating,
        students: students !== undefined ? students : existing.students,
        duration: duration || existing.duration,
        lessons: lessons !== undefined ? lessons : existing.lessons,
        description: description || existing.description
      };

      const updateSql = `
        UPDATE courses
        SET title = ?, instructor = ?, category = ?, level = ?, rating = ?, students = ?, duration = ?, lessons = ?, description = ?
        WHERE id = ?
      `;

      db.query(
        updateSql,
        [
          updated.title,
          updated.instructor,
          updated.category,
          updated.level,
          updated.rating,
          updated.students,
          updated.duration,
          updated.lessons,
          updated.description,
          courseId
        ],
        (updateErr) => {
          if (updateErr) {
            return res.status(500).json({
              success: false,
              message: "Failed to update course."
            });
          }

          return res.status(200).json({
            success: true,
            message: "Course updated successfully!",
            course: { id: courseId, ...updated }
          });
        }
      );
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error updating course."
    });
  }
};

// ==================================================
// DELETE COURSE
// DELETE /api/courses/:id
// ==================================================
const deleteCourse = async (req, res) => {
  try {
    const courseId = Number(req.params.id);

    const deleteSql = "DELETE FROM courses WHERE id = ?";

    db.query(deleteSql, [courseId], (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Failed to delete course."
        });
      }

      return res.status(200).json({
        success: true,
        message: "Course deleted successfully!"
      });
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error deleting course."
    });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
};
