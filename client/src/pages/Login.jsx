import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import "../assets/css/auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { showToast } = useToast();
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:4044/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Invalid email or password");
      }
      const data = await res.json();
      login(data.token, data.user);
      showToast("login successful!", "success");
      setEmail("");
      setPassword("");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Login failed:", error);
      showToast("Login failed!");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-effect">
        <div className="auth-header">
          <div className="auth-icon">
            <div className="icon-pulse"></div>
            <span className="icon-text">⚡</span>
          </div>
          <h1 className="gradient-text">Welcome Back</h1>
          <p className="auth-subtitle">
            Enter your credentials to access your tasks
          </p>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          <div className="input-group">
            <label className="input-label">
              <span className="label-icon">✉️</span>
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
            />
          </div>

          <div className="input-group">
            <label className="input-label">
              <span className="label-icon">🔒</span>
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
            />
          </div>

          <button type="submit" className="btn btn-primary">
            <span className="btn-content">
              {/* <span className="btn-icon">→</span> */}
              Login
            </span>
          </button>
        </form>

        <div className="auth-footer">
          <p className="auth-link-text">
            Don't have an account?{" "}
            <NavLink to="/register" className="auth-link">
              <span className="link-glow">Create Account</span>
            </NavLink>
          </p>
        </div>
      </div>

      {/* Background Elements */}
      <div className="bg-element bg-1"></div>
      <div className="bg-element bg-2"></div>
      <div className="bg-element bg-3"></div>
    </div>
  );
};

export default Login;
