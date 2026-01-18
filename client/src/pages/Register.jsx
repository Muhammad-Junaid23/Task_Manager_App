import { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import "../assets/css/auth.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { showToast } = useToast();

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:4044/api/users/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Invalid email or password");
      }
      const data = await res.json();
      console.log("registered data", data);
      showToast("Register successful!", "success");
      setName("");
      setEmail("");
      setPassword("");
      navigate("/login");
    } catch (error) {
      console.error("Login failed:", error);
      showToast("Register failed!");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-effect">
        <div className="auth-header">
          <div className="auth-icon">
            <div className="icon-pulse"></div>
            <span className="icon-text">🚀</span>
          </div>
          <h1 className="gradient-text">Create Account</h1>
          <p className="auth-subtitle">Join our futuristic task manager</p>
        </div>

        <form onSubmit={handleRegister} className="auth-form">
          <div className="input-group">
            <label className="input-label">
              <span className="label-icon">👤</span>
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="input-field"
            />
          </div>

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
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
            />
          </div>

          <button type="submit" className="btn btn-primary">
            <span className="btn-content">
              <span className="btn-icon">✨</span>
              Create Account
            </span>
          </button>
        </form>

        <div className="auth-footer">
          <p className="auth-link-text">
            Already have an account?{" "}
            <NavLink to="/login" className="auth-link">
              <span className="link-glow">Log In</span>
            </NavLink>
          </p>
        </div>
      </div>

      <div className="bg-element bg-1"></div>
      <div className="bg-element bg-2"></div>
      <div className="bg-element bg-3"></div>
    </div>
  );
};

export default Register;
