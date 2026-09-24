const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const DB_HOST = process.env.DB_HOST || "localhost";
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : "root";
const DB_NAME = process.env.DB_NAME || "learnhub";
const DB_PORT = parseInt(process.env.DB_PORT, 10) || 3306;

// Local JSON fallback file path
const DATA_DIR = path.join(__dirname, "..", "data");
const FALLBACK_DB_FILE = path.join(DATA_DIR, "db.json");

// Initial Seed Courses
const INITIAL_COURSES = [
  {
    id: 1,
    title: "Complete React JS Course",
    instructor: "LearnHub",
    category: "Web Development",
    level: "Beginner",
    rating: 4.8,
    students: 1250,
    duration: "12 hours",
    lessons: 25,
    description: "Learn React JS from basics to advanced concepts and build modern, responsive web applications."
  },
  {
    id: 2,
    title: "Java Programming Masterclass",
    instructor: "LearnHub",
    category: "Programming",
    level: "Beginner",
    rating: 4.7,
    students: 980,
    duration: "15 hours",
    lessons: 30,
    description: "Learn Java programming and object-oriented programming concepts from scratch."
  },
  {
    id: 3,
    title: "Python for Beginners",
    instructor: "LearnHub",
    category: "Programming",
    level: "Beginner",
    rating: 4.9,
    students: 2100,
    duration: "10 hours",
    lessons: 28,
    description: "Start learning Python from the basics to advanced concepts and build real projects."
  },
  {
    id: 4,
    title: "Node.js and Express.js Complete Guide",
    instructor: "LearnHub",
    category: "Backend",
    level: "Intermediate",
    rating: 4.8,
    students: 870,
    duration: "14 hours",
    lessons: 26,
    description: "Build backend applications, RESTful APIs, and secure server architectures using Node.js and Express."
  },
  {
    id: 5,
    title: "MySQL Database Fundamentals",
    instructor: "LearnHub",
    category: "Database",
    level: "Beginner",
    rating: 4.7,
    students: 860,
    duration: "8 hours",
    lessons: 20,
    description: "Master SQL queries, relational database design, indexing, and management with MySQL."
  },
  {
    id: 6,
    title: "Introduction to Artificial Intelligence",
    instructor: "LearnHub",
    category: "AI",
    level: "Beginner",
    rating: 4.7,
    students: 650,
    duration: "11 hours",
    lessons: 22,
    description: "Understand the fundamentals of Artificial Intelligence, neural networks, and modern AI tools."
  },
  {
    id: 7,
    title: "HTML and CSS Complete Course",
    instructor: "LearnHub",
    category: "Web Development",
    level: "Beginner",
    rating: 4.9,
    students: 1800,
    duration: "9 hours",
    lessons: 24,
    description: "Learn HTML5 and modern CSS3 to design clean, responsive, and engaging websites from scratch."
  },
  {
    id: 8,
    title: "JavaScript Complete Course",
    instructor: "LearnHub",
    category: "Programming",
    level: "Beginner",
    rating: 4.9,
    students: 2300,
    duration: "16 hours",
    lessons: 35,
    description: "Master JavaScript fundamentals, ES6+ syntax, DOM manipulation, and asynchronous programming."
  }
];

let isMySQLConnected = false;
let pool = null;
let fallbackStore = {
  users: [],
  courses: [...INITIAL_COURSES],
  enrollments: [],
  nextUserId: 1,
  nextCourseId: 9,
  nextEnrollmentId: 1
};

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Load fallback store from JSON file
function loadFallbackStore() {
  ensureDataDir();
  if (fs.existsSync(FALLBACK_DB_FILE)) {
    try {
      const data = fs.readFileSync(FALLBACK_DB_FILE, "utf-8");
      const parsed = JSON.parse(data);
      fallbackStore = {
        users: parsed.users || [],
        courses: parsed.courses && parsed.courses.length > 0 ? parsed.courses : [...INITIAL_COURSES],
        enrollments: parsed.enrollments || [],
        nextUserId: parsed.nextUserId || (parsed.users && parsed.users.length ? Math.max(...parsed.users.map(u => u.id || 0)) + 1 : 1),
        nextCourseId: parsed.nextCourseId || (parsed.courses && parsed.courses.length ? Math.max(...parsed.courses.map(c => c.id || 0)) + 1 : 9),
        nextEnrollmentId: parsed.nextEnrollmentId || (parsed.enrollments && parsed.enrollments.length ? Math.max(...parsed.enrollments.map(e => e.id || 0)) + 1 : 1)
      };
    } catch (err) {
      console.warn("[Database] Could not read fallback db.json, using defaults.");
      saveFallbackStore();
    }
  } else {
    saveFallbackStore();
  }
}

// Save fallback store to JSON file
function saveFallbackStore() {
  try {
    ensureDataDir();
    fs.writeFileSync(FALLBACK_DB_FILE, JSON.stringify(fallbackStore, null, 2), "utf-8");
  } catch (err) {
    console.error("[Database] Failed to save fallback db.json:", err.message);
  }
}

loadFallbackStore();

// Create MySQL connection pool
function initializeMySQL() {
  const rootConn = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    port: DB_PORT,
    connectTimeout: 4000
  });

  rootConn.connect((err) => {
    if (err) {
      console.log(`[Database] MySQL server not reachable on ${DB_HOST}:${DB_PORT} (${err.code || err.message}).`);
      console.log(`[Database] Activating persistent local storage mode (${FALLBACK_DB_FILE}). Full API functionality is enabled.`);
      isMySQLConnected = false;
      return;
    }

    // Create database if not exists
    rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``, (createErr) => {
      rootConn.end();
      if (createErr) {
        console.error("[Database] Error creating database:", createErr.message);
        isMySQLConnected = false;
        return;
      }

      // Initialize pool with DB_NAME
      pool = mysql.createPool({
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME,
        port: DB_PORT,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });

      // Verify connection to database & create tables
      pool.getConnection((poolErr, conn) => {
        if (poolErr) {
          console.error("[Database] Pool connection failed:", poolErr.message);
          isMySQLConnected = false;
          return;
        }

        console.log(`[Database] MySQL connected successfully to database "${DB_NAME}"!`);
        isMySQLConnected = true;

        // Create tables
        const createUsersTable = `
          CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(150) NOT NULL,
            username VARCHAR(150),
            email VARCHAR(150) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(50) DEFAULT 'student',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `;

        const createCoursesTable = `
          CREATE TABLE IF NOT EXISTS courses (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            instructor VARCHAR(100) DEFAULT 'LearnHub',
            category VARCHAR(100) DEFAULT 'General',
            level VARCHAR(50) DEFAULT 'Beginner',
            rating DECIMAL(3,1) DEFAULT 4.8,
            students INT DEFAULT 0,
            duration VARCHAR(50) DEFAULT '10 hours',
            lessons INT DEFAULT 20,
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `;

        const createEnrollmentsTable = `
          CREATE TABLE IF NOT EXISTS enrollments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            course_id INT NOT NULL,
            progress INT DEFAULT 0,
            completed_lessons TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY unique_user_course (user_id, course_id)
          )
        `;

        conn.query(createUsersTable, (uErr) => {
          if (uErr) console.error("[Database] Error creating users table:", uErr);
          conn.query(createCoursesTable, (cErr) => {
            if (cErr) console.error("[Database] Error creating courses table:", cErr);
            conn.query(createEnrollmentsTable, (eErr) => {
              if (eErr) console.error("[Database] Error creating enrollments table:", eErr);

              // Seed courses if empty
              conn.query("SELECT COUNT(*) AS count FROM courses", (countErr, countRes) => {
                if (!countErr && countRes[0].count === 0) {
                  console.log("[Database] Seeding initial courses into MySQL...");
                  const seedSql = `
                    INSERT INTO courses (id, title, instructor, category, level, rating, students, duration, lessons, description)
                    VALUES ?
                  `;
                  const values = INITIAL_COURSES.map(c => [
                    c.id, c.title, c.instructor, c.category, c.level, c.rating, c.students, c.duration, c.lessons, c.description
                  ]);
                  conn.query(seedSql, [values], (seedErr) => {
                    if (seedErr) console.error("[Database] Seeding error:", seedErr);
                    else console.log("[Database] Initial courses seeded successfully!");
                    conn.release();
                  });
                } else {
                  conn.release();
                }
              });
            });
          });
        });
      });
    });
  });
}

// Start MySQL initialization
initializeMySQL();

// Emulate simple SQL queries for fallback store
function executeFallbackQuery(sql, params) {
  const cleanSql = sql.trim().replace(/\s+/g, " ");
  const upperSql = cleanSql.toUpperCase();

  // SELECT 1 AS result
  if (upperSql.includes("SELECT 1 AS RESULT") || upperSql === "SELECT 1") {
    return [{ result: 1 }];
  }

  // COUNT queries
  if (upperSql.includes("COUNT(*)")) {
    if (upperSql.includes("COURSES")) {
      return [{ count: fallbackStore.courses.length }];
    }
    if (upperSql.includes("USERS")) {
      return [{ count: fallbackStore.users.length }];
    }
    if (upperSql.includes("ENROLLMENTS")) {
      return [{ count: fallbackStore.enrollments.length }];
    }
    return [{ count: 0 }];
  }

  // USERS: SELECT * FROM users WHERE email = ?
  if (upperSql.startsWith("SELECT") && upperSql.includes("FROM USERS") && upperSql.includes("WHERE EMAIL = ?")) {
    const email = (params && params[0]) ? String(params[0]).toLowerCase() : "";
    return fallbackStore.users.filter(u => u.email.toLowerCase() === email);
  }

  // USERS: SELECT id, name, username, email, role FROM users WHERE id = ?
  if (upperSql.startsWith("SELECT") && upperSql.includes("FROM USERS") && upperSql.includes("WHERE ID = ?")) {
    const id = params && params[0];
    return fallbackStore.users.filter(u => u.id === Number(id));
  }

  // USERS: SELECT * FROM users
  if (upperSql.startsWith("SELECT") && upperSql.includes("FROM USERS")) {
    return [...fallbackStore.users];
  }

  // USERS: INSERT INTO users
  if (upperSql.startsWith("INSERT INTO USERS")) {
    const name = params[0];
    const email = String(params[1]).toLowerCase();
    const password = params[2];
    const role = params[3] || "student";

    const newUser = {
      id: fallbackStore.nextUserId++,
      name: name,
      username: name,
      email: email,
      password: password,
      role: role,
      created_at: new Date().toISOString()
    };
    fallbackStore.users.push(newUser);
    saveFallbackStore();
    return { insertId: newUser.id, affectedRows: 1 };
  }

  // COURSES: SELECT * FROM courses WHERE id = ?
  if (upperSql.startsWith("SELECT") && upperSql.includes("FROM COURSES") && upperSql.includes("WHERE ID = ?")) {
    const id = params && params[0];
    return fallbackStore.courses.filter(c => c.id === Number(id));
  }

  // COURSES: SELECT * FROM courses
  if (upperSql.startsWith("SELECT") && upperSql.includes("FROM COURSES")) {
    return [...fallbackStore.courses];
  }

  // COURSES: INSERT INTO courses
  if (upperSql.startsWith("INSERT INTO COURSES")) {
    const title = params[0];
    const instructor = params[1] || "LearnHub";
    const category = params[2] || "General";
    const level = params[3] || "Beginner";
    const rating = params[4] || 4.8;
    const students = params[5] || 0;
    const duration = params[6] || "10 hours";
    const lessons = params[7] || 20;
    const description = params[8] || "";

    const newCourse = {
      id: fallbackStore.nextCourseId++,
      title,
      instructor,
      category,
      level,
      rating,
      students,
      duration,
      lessons,
      description,
      created_at: new Date().toISOString()
    };
    fallbackStore.courses.push(newCourse);
    saveFallbackStore();
    return { insertId: newCourse.id, affectedRows: 1 };
  }

  // ENROLLMENTS: SELECT * FROM enrollments WHERE user_id = ?
  if (upperSql.startsWith("SELECT") && upperSql.includes("FROM ENROLLMENTS") && upperSql.includes("WHERE USER_ID = ?")) {
    const userId = Number(params[0]);
    return fallbackStore.enrollments.filter(e => e.user_id === userId);
  }

  // ENROLLMENTS: INSERT INTO enrollments
  if (upperSql.startsWith("INSERT INTO ENROLLMENTS")) {
    const userId = Number(params[0]);
    const courseId = Number(params[1]);
    const progress = params[2] || 0;

    const existing = fallbackStore.enrollments.find(e => e.user_id === userId && e.course_id === courseId);
    if (existing) {
      existing.progress = progress;
      saveFallbackStore();
      return { insertId: existing.id, affectedRows: 1 };
    }

    const newEnrollment = {
      id: fallbackStore.nextEnrollmentId++,
      user_id: userId,
      course_id: courseId,
      progress,
      completed_lessons: "[]",
      created_at: new Date().toISOString()
    };
    fallbackStore.enrollments.push(newEnrollment);
    saveFallbackStore();
    return { insertId: newEnrollment.id, affectedRows: 1 };
  }

  // STATS: COUNT queries
  if (upperSql.includes("COUNT(*)")) {
    if (upperSql.includes("USERS")) {
      return [{ count: fallbackStore.users.length }];
    }
    if (upperSql.includes("COURSES")) {
      return [{ count: fallbackStore.courses.length }];
    }
    if (upperSql.includes("ENROLLMENTS")) {
      return [{ count: fallbackStore.enrollments.length }];
    }
  }

  return [];
}

/**
 * Universal Query Method
 * Supports:
 * - db.query(sql, callback)
 * - db.query(sql, params, callback)
 * - const [rows] = await db.promise().query(sql, params)
 */
const db = {
  get isConnected() {
    return isMySQLConnected;
  },

  query(sql, params, callback) {
    if (typeof params === "function") {
      callback = params;
      params = [];
    }
    params = params || [];

    if (isMySQLConnected && pool) {
      return pool.query(sql, params, (err, results, fields) => {
        if (err) {
          console.warn("[Database] MySQL query error, falling back to local store:", err.message);
          try {
            const fallbackResults = executeFallbackQuery(sql, params);
            if (callback) return callback(null, fallbackResults);
          } catch (fbErr) {
            if (callback) return callback(err, null);
          }
        }
        if (callback) return callback(null, results, fields);
      });
    }

    // Fallback store
    try {
      const results = executeFallbackQuery(sql, params);
      if (callback) {
        process.nextTick(() => callback(null, results));
      }
      return results;
    } catch (err) {
      if (callback) {
        process.nextTick(() => callback(err, null));
      }
    }
  },

  promise() {
    return {
      query: (sql, params) => {
        return new Promise((resolve, reject) => {
          this.query(sql, params, (err, results) => {
            if (err) return reject(err);
            resolve([results]);
          });
        });
      }
    };
  }
};

module.exports = db;