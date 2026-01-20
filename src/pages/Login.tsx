import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import axiosClient from "../api/axiosClient";

const Login: React.FC = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = (): string | null => {
    if (!username) return "Username is required.";
    if (!password) return "Password is required.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      // Use URLSearchParams to send data as application/x-www-form-urlencoded
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      const res = await axiosClient.post("/auth/login", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      const data = res.data;

      // Save token + admin flag to context and localStorage
      login(data.access_token, data.is_admin);

      // *** CRITICAL FIX ***
      // Ensure axiosClient automatically sends this token on all requests
      axiosClient.defaults.headers.common["Authorization"] =
        `Bearer ${data.access_token}`;

      // Redirect based on role
      if (data.is_admin) {
        navigate("/admin", { replace: true });
      } else {
        navigate("/upload", { replace: true });
      }

    } catch (err: any) {
      console.error("Login Error Details:", err);
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Login failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Background Shapes */}
      <div className="login-shape login-shape-1"></div>
      <div className="login-shape login-shape-2"></div>
      <div className="login-shape login-shape-3"></div>

      <div className="login-card">
        <div className="login-header">
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">Enter your credentials to access the F.R.A.U.D.S system</p>
        </div>

        {error && <div className="login-error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-input-group">
            <label className="login-label">Username</label>
            <div className="login-input-wrapper">
              <span className="login-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </span>
              <input
                type="text"
                className="login-input"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="login-input-group">
            <label className="login-label">Password</label>
            <div className="login-input-wrapper">
              <span className="login-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                className="login-input"
                placeholder="******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="login-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? <span className="login-loader"></span> : "Sign In"}
          </button>
        </form>

        <div className="login-footer-text">
          <p>Don't have an account? <span className="login-contact-admin">Contact Admin</span></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
