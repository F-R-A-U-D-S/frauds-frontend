import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const API_URL = "http://127.0.0.1:8000/auth";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Basic validation
  const validate = (): string | null => {
    if (!email) return "Email is required.";
    const re = /\S+@\S+\.\S+/;
    if (!re.test(email)) return "Enter a valid email.";
    if (!password) return "Password is required.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    return null;
  };

  // Handle form submission
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
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.detail || "Login failed");
      }

      const data = await res.json();
      if (data.access_token) localStorage.setItem("token", data.access_token);

      navigate("/"); // go to App page after login
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
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
          <label>Email</label>
          <input
            type="text"
            placeholder="Enter Email or Employee ID"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

          <div>
            <div>
              <label className="remember-container">
                <input type="checkbox" /> Remember me
              </label>
            </div>
            <div>
              <a href="#" className="forgot-link">Forgot Password?</a>
            </div>
          </div>
          

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Loading..." : "Sign in"} 
          </button>
        </form>

        <p className="register-text">
          Don’t have an account? <a href="#">Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;