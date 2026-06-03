import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/adminlogin.css";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (password === "goldcoasthair2026") {
      navigate("/dashboard");
    } else {
      alert("Incorrect Password");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="logo-container">
          <img
            src="/logo.png"
            alt="Company Logo"
            className="logo"
          />
        </div>

        <h1>Admin Portal</h1>

        <p className="subtitle">
          Enter master password to continue
        </p>

        <div className="form-group">
          <label>Master Password</label>

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          className="login-btn"
          onClick={handleLogin}
        >
          Access Portal
        </button>
      </div>
    </div>
  );
}