import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Empty fields
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    // Password validation
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Invalid email or password."
        );
        return;
      }

      // Save user & auth info
      const displayName = data.user.name || data.user.username || data.user.email.split("@")[0];
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("userName", displayName);
      localStorage.setItem("userEmail", data.user.email);
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      localStorage.setItem("isLoggedIn", "true");

      // Go to home
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);

      setError(
        "Unable to connect to the server. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <h2 style={styles.title}>
          Welcome Back
        </h2>

        <p style={styles.subtitle}>
          Login to continue learning
        </p>

        <form onSubmit={handleSubmit}>

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            style={styles.input}
          />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            style={styles.input}
          />

          {/* PASSWORD WARNING */}
          {password.length > 0 &&
            password.length < 8 && (
              <p style={styles.warning}>
                ⚠ Password must be at least 8 characters.
              </p>
            )}

          {/* ERROR */}
          {error && (
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
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p style={styles.registerText}>
          Don't have an account?{" "}

          <Link
            to="/register"
            style={styles.link}
          >
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