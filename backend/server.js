const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const userRoutes = require("./routes/userRoutes");
const { getAdminStats } = require("./controllers/userController");

const app = express();

// ==================================================
// CORS CONFIGURATION
// ==================================================
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) return callback(null, true);

      // Allow all localhost and 127.0.0.1 origins on any port for development
      if (
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:") ||
        origin === "http://localhost" ||
        origin === "http://127.0.0.1"
      ) {
        return callback(null, true);
      }

      // Default allow
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-access-token"],
    credentials: true
  })
);

// ==================================================
// BODY PARSER
// ==================================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================================================
// API ROUTES
// ==================================================

// Auth routes (/api/auth/register, /api/auth/login, /api/auth/me)
app.use("/api/auth", authRoutes);

// Course routes (/api/courses, /api/courses/:id)
app.use("/api/courses", courseRoutes);

// User & enrollment routes (/api/users/profile, /api/users/enrolled, /api/users/enroll, /api/users/progress)
app.use("/api/users", userRoutes);

// Admin stats endpoint (/api/admin/stats)
app.get("/api/admin/stats", getAdminStats);

// ==================================================
// HEALTH & DIAGNOSTIC ENDPOINTS
// ==================================================

// Home / Server Status
app.get("/", (req, res) => {
  res.json({
    success: true,
    name: "LearnHub API",
    status: "running",
    version: "1.0.0",
    database: db.isConnected ? "MySQL" : "Local Storage (Active)",
    endpoints: {
      auth: "/api/auth",
      courses: "/api/courses",
      users: "/api/users",
      admin: "/api/admin/stats"
    }
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Database status & test
app.get("/api/test-db", (req, res) => {
  db.query("SELECT 1 AS result", (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Database connection failed",
        error: err.message
      });
    }

    res.json({
      success: true,
      mode: db.isConnected ? "MySQL Database" : "Persistent Local Storage",
      message: "Database operation executed successfully!",
      result: results
    });
  });
});

// ==================================================
// 404 NOT FOUND HANDLER
// ==================================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`
  });
});

// ==================================================
// GLOBAL ERROR HANDLER
// ==================================================
app.use((err, req, res, next) => {
  console.error("[Server Error]:", err.message || err);

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "CORS policy blocked this request"
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined
  });
});

// ==================================================
// START SERVER
// ==================================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("=================================");
  console.log("       LearnHub Backend");
  console.log(`Server running on port ${PORT}`);
  console.log(`URL: http://localhost:${PORT}`);
  console.log("=================================");
});

module.exports = app;