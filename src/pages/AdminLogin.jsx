import "../styles/adminlogin.css";

export default function AdminLogin() {
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
          />
        </div>

        <button className="login-btn">
          Access Portal
        </button>
      </div>
    </div>
  );
}