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

// Pages
import Home from "./pages/Home";
import Profile from "./pages/profile";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import MyCourses from "./pages/MyCourses";
import LearnCourse from "./pages/LearnCourse";
import Login from "./pages/Login";
import Register from "./components/Register";
import AdminDashboard from "./pages/AdminDashboard";
import Dashboard from "./pages/Dashboard";

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

  const displayName = user
    ? user.name || user.username || user.email?.split("@")[0] || "Profile"
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
      <ToastContainer> 
        position="top-right"
        autoClose={3000}
        theme="colored"
        </ToastContainer>
      {/* Logo */}
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

      {/* Navigation Links */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "30px",
        }}
      >
        <Link
          to="/"
          style={{
            textDecoration: "none",
            color: "#222",
            fontSize: "16px",
            fontWeight: "500",
          }}
        >
          Home
        </Link>

        <Link
          to="/courses"
          style={{
            textDecoration: "none",
            color: "#222",
            fontSize: "16px",
            fontWeight: "500",
          }}
        >
          Courses
        </Link>

        <Link
          to="/my-courses"
          style={{
            textDecoration: "none",
            color: "#222",
            fontSize: "16px",
            fontWeight: "500",
          }}
        >
          My Courses
        </Link>

        <Link
          to="/profile"
          style={{
            textDecoration: "none",
            color: "#222",
            fontSize: "16px",
            fontWeight: "500",
          }}
        >
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
              fontSize: "16px",
              fontWeight: "500",
            }}
          >
            {displayName}
          </Link>
        ) : (
          <>
            <Link
              to="/login"
              style={{
                textDecoration: "none",
                color: "#222",
                fontSize: "16px",
                fontWeight: "500",
              }}
            >
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
                fontSize: "16px",
                fontWeight: "500",
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

function App() {
  return (
    <BrowserRouter>
      {/* =========================
          NAVIGATION BAR
      ========================= */}
      <NavigationBar />

      {/* =========================
          PAGES / ROUTES
      ========================= */}
      <Routes>
        {/* HOME */}
        <Route path="/" element={<Home />} />

        {/* PROFILE */}
        <Route path="/profile" element={<Profile />} />

        {/* ALL COURSES */}
        <Route path="/courses" element={<Courses />} />

        {/* COURSE DETAILS (Supports both /course/:id and /courses/:id) */}
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/courses/:id" element={<CourseDetails />} />

        {/* MY COURSES */}
        <Route path="/my-courses" element={<MyCourses />} />

        {/* DASHBOARD */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* LEARNING PAGE */}
        <Route path="/learn/:id" element={<LearnCourse />} />

        {/* LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* REGISTER */}
        <Route path="/register" element={<Register />} />

        {/* ADMIN DASHBOARD */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/*" element={<AdminDashboard />} />

        {/* FALLBACK */}
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
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;