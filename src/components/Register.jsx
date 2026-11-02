
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signupUser,
  clearMessage,
} from "../slices/authSlice.js";

// Configure the admin email
const ADMIN_EMAIL = "vaishnaviboopathi12@gmail.com";

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, success } = useSelector(
    (state) => state.auth
  );

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [validationError, setValidationError] = useState("");

  // Handle input changes
  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));

    setValidationError("");
    dispatch(clearMessage());
  }

  // Handle registration
  async function handleRegister(e) {
    e.preventDefault();

    setValidationError("");

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.password ||
      !form.confirmPassword
    ) {
      setValidationError("Please fill in all fields.");
      return;
    }

    if (form.password.length < 8) {
      setValidationError(
        "Password must be at least 8 characters long."
      );
      return;
    }

    if (form.password !== form.confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    // Check whether this is the configured admin email
    const isAdmin =
      form.email.trim().toLowerCase() ===
      ADMIN_EMAIL.toLowerCase();

    // Assign role
    const role = isAdmin ? "ADMIN" : "STUDENT";

    try {
      await dispatch(
        signupUser({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          role: role,
        })
      ).unwrap();

      setForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      alert(
        isAdmin
          ? "Admin account registered successfully! Please login."
          : "Student account registered successfully! Please login."
      );

      navigate("/login");
    } catch (err) {
      console.error("Registration failed:", err);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create Account</h1>

        <p>Register to start learning with LearnHub</p>

        {(validationError || error) && (
          <div className="error-message">
            ⚠ {validationError || error}
          </div>
        )}

        {success && !loading && (
          <div className="success-message">
            ✓ {success}
          </div>
        )}

        <form onSubmit={handleRegister}>
          {/* NAME */}
          <div className="form-group">
            <label htmlFor="name">Name</label>

            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* EMAIL */}
          <div className="form-group">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="form-group">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="form-group">
            <label htmlFor="confirmPassword">
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {/* REGISTER BUTTON */}
          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account?</p>

          <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
