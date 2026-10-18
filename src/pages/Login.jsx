
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, logout } from "../slices/authSlice.js";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, loading, error } = useSelector(
    (state) => state.auth
  );

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [validationError, setValidationError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));

    setValidationError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setValidationError("");

    if (!form.email.trim() || !form.password) {
      setValidationError("Please enter email and password.");
      return;
    }

    if (form.password.length < 8) {
      setValidationError(
        "Password must be at least 8 characters long."
      );
      return;
    }

    try {
      await dispatch(
        loginUser({
          email: form.email.trim(),
          password: form.password,
        })
      ).unwrap();

      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
    }
  }

  if (user) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.title}>
            Welcome, {user.name || user.username || user.email}!
          </h2>

          <p style={styles.subtitle}>
            You are logged in to LearnHub.
          </p>

          <button
            type="button"
            style={styles.button}
            onClick={() => {
              dispatch(logout());
              navigate("/login");
            }}
          >
            Logout
          </button>

          <p style={styles.registerText}>
            <Link to="/" style={styles.link}>
              Go to Home
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back</h2>

        <p style={styles.subtitle}>
          Login to continue learning
        </p>

        <form onSubmit={handleSubmit}>
          {/* EMAIL */}
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            style={styles.input}
            required
          />

          {/* PASSWORD */}
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            style={styles.input}
            required
          />

          {/* PASSWORD WARNING */}
          {form.password.length > 0 &&
            form.password.length < 8 && (
              <p style={styles.warning}>
                ⚠ Password must be at least 8 characters.
              </p>
            )}

          {/* VALIDATION ERROR */}
          {validationError && (
            <p style={styles.error}>
              ⚠ {validationError}
            </p>
          )}

          {/* REDUX / API ERROR */}
          {!validationError && error && (
            <p style={styles.error}>
              ⚠ {error}
            </p>
          )}

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={styles.registerText}>
          Don't have an account?{" "}
          <Link to="/register" style={styles.link}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "calc(100vh - 70px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f6ff",
    padding: "30px",
  },

  card: {
    width: "400px",
    background: "#ffffff",
    padding: "35px",
    borderRadius: "15px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },

  title: {
    textAlign: "center",
    marginBottom: "8px",
    color: "#29277d",
  },

  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: "25px",
  },

  input: {
    width: "100%",
    padding: "13px",
    marginBottom: "12px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxSizing: "border-box",
    fontSize: "15px",
  },

  warning: {
    color: "#d97706",
    fontSize: "13px",
    marginTop: "-5px",
    marginBottom: "12px",
  },

  error: {
    color: "#dc2626",
    background: "#fee2e2",
    padding: "10px",
    borderRadius: "7px",
    fontSize: "14px",
  },

  button: {
    width: "100%",
    padding: "13px",
    border: "none",
    borderRadius: "8px",
    background: "#5856e8",
    color: "white",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },

  registerText: {
    textAlign: "center",
    marginTop: "20px",
    color: "#666",
  },

  link: {
    color: "#5856e8",
    textDecoration: "none",
    fontWeight: "600",
  },
};

export default Login;
