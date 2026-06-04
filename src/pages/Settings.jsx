import Sidebar from "../components/Sidebar";
import "../styles/settings.css";

export default function Settings() {
  return (
    <div className="dashboard">
      <Sidebar />

      <main className="settings-page">
        <div className="settings-header">
          <h1>Settings</h1>
          <p>
            Manage your admin account and store settings.
          </p>
        </div>

        <div className="settings-card">
          <h2>Admin Profile</h2>

          <div className="form-group">
            <label>Admin Name</label>
            <input
              type="text"
              placeholder="Administrator"
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="admin@goldcoasthair.com"
            />
          </div>

          <div className="form-group">
            <label>Change Password</label>
            <input
              type="password"
              placeholder="New Password"
            />
          </div>

          <button className="save-settings-btn">
            Save Changes
          </button>
        </div>
      </main>
    </div>
  );
}