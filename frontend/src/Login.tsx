import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
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

      console.log("Login response:", data);

      if (!response.ok) {
        throw new Error(data.detail || "Login failed.");
      }

      // Save JWT token
      localStorage.setItem("token", data.access_token);
      window.dispatchEvent(new Event("authChange"));

      // Go to dashboard
      navigate("/");
    } catch (err: any) {
      console.error("LOGIN ERROR:", err);

      setError(
        err.message || "Something went wrong during login."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="brand-icon">⚡</div>

        <h1>AI Placement Copilot</h1>

        <p>
          Login to continue your placement preparation.
        </p>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="primary-button"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        <p className="register-link">
          Don't have an account?{" "}
          <NavLink to="/register">
            Create Account
          </NavLink>
        </p>

      </div>
    </div>
  );
}

export default Login;