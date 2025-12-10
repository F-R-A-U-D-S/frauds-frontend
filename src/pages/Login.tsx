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
      const res = await axiosClient.post("/auth/login", {
        username,
        password,
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
      <div className="login-card">
        <h2 className="title">Sign in</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="form">

          <label>Username</label>
          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label>Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="show-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* <label className="remember-container">
            <input type="checkbox" /> Remember me
          </label> */}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Loading..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
