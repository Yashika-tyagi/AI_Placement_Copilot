import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";

function Registration() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [targetRole, setTargetRole] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async () => {
    setError("");

    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim() ||
      !targetRole.trim()
    ) {
      setError("Please fill all fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
            target_role: targetRole,
          }),
        }
      );

      const data = await response.json();

      console.log("Registration response:", data);

      if (!response.ok) {
        throw new Error(
          data.detail || "Registration failed."
        );
      }

      alert("Registration successful! Please login.");

      navigate("/login");
    } catch (err: any) {
      console.error("REGISTRATION ERROR:", err);

      setError(
        err.message ||
          "Something went wrong during registration."
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
          Create your account to start your placement preparation.
        </p>

        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="text"
          placeholder="Target role (e.g. Software Engineer)"
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
        />

        <button
          className="primary-button"
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        <p className="register-link">
          Already have an account?{" "}
          <NavLink to="/login">
            Login
          </NavLink>
        </p>

      </div>
    </div>
  );
}

export default Registration;