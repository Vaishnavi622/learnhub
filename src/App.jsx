import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";

// Student Pages
import Home from "./pages/Home";
import Profile from "./pages/profile";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import MyCourses from "./pages/MyCourses";
import LearnCourse from "./pages/LearnCourse";
import Login from "./pages/Login";
import Register from "./components/Register";
import Dashboard from "./pages/Dashboard";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminCourses from "./pages/AdminCourses";
import AddCourse from "./pages/AddCourses";
import EditCourse from "./pages/EditCourses";
import ViewCourse from "./pages/ViewCourse";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

// Navigation Bar
function NavigationBar() {
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");

      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, [location]);

  // Hide student navbar on admin pages
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  const displayName = user
    ? user.name ||
      user.username ||
      user.email?.split("@")[0] ||
      "Profile"
    : "";

  return (
    <nav
      style={{
        width: "100%",
        height: "70px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 50px",
        boxSizing: "border-box",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e5e5e5",
      }}
    >
      <Link
        to="/"
        style={{
          textDecoration: "none",
          fontSize: "24px",
          fontWeight: "700",
          color: "#29277d",
        }}
      >
        LearnHub
      </Link>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "30px",
        }}
      >
        <Link to="/" className="nav-link">
          Home
        </Link>

        <Link to="/courses" className="nav-link">
          Courses
        </Link>

        <Link to="/my-courses" className="nav-link">
          My Courses
        </Link>

        <Link to="/profile" className="nav-link">
          Profile
        </Link>

        {user ? (
          <Link
            to="/profile"
            style={{
              textDecoration: "none",
              color: "#ffffff",
              backgroundColor: "#5856e8",
              padding: "10px 20px",
              borderRadius: "8px",
            }}
          >
            {displayName}
          </Link>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              Login
            </Link>

            <Link
              to="/register"
              style={{
                textDecoration: "none",
                color: "#ffffff",
                backgroundColor: "#5856e8",
                padding: "10px 20px",
                borderRadius: "8px",
              }}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

// Main App
function App() {
  return (
    <BrowserRouter>
      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="colored"
      />

      {/* Navigation Bar */}
      <NavigationBar />

      {/* Application Routes */}
      <Routes>
        {/* Student Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/courses" element={<Courses />} />

        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/courses/:id" element={<CourseDetails />} />

        <Route path="/my-courses" element={<MyCourses />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/learn/:id" element={<LearnCourse />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ADMIN PROTECTED ROUTES */}
<Route element={<AdminProtectedRoute />}>
  <Route path="/admin" element={<AdminDashboard />} />

  <Route path="/admin/courses" element={<AdminCourses />} />

  <Route path="/admin/courses/add" element={<AddCourse />} />

  <Route
    path="/admin/courses/edit/:id"
    element={<EditCourse />}
  />

  <Route
    path="/admin/courses/view/:id"
    element={<ViewCourse />}
  />
</Route>

        {/* 404 Page */}
        <Route
          path="*"
          element={
            <div
              style={{
                minHeight: "70vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <h1>404</h1>
              <p>Page not found</p>
              <Link to="/">Go Home</Link>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;