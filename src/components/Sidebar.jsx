import {
  FiGrid,
  FiBox,
  FiShoppingCart,
  FiTag,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

import { NavLink } from "react-router-dom";
import "../styles/sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <img
          src="/logo.png"
          alt="Gold Coast Hair"
          className="sidebar-logo"
        />

        <nav className="sidebar-nav">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <FiGrid />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/products"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <FiBox />
            <span>Products</span>
          </NavLink>

          <NavLink
            to="/orders"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <FiShoppingCart />
            <span>Orders</span>
          </NavLink>

          <NavLink
            to="/promotions"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <FiTag />
            <span>Promotions</span>
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <FiSettings />
            <span>Settings</span>
          </NavLink>
        </nav>
      </div>

      <button className="logout-btn">
        <FiLogOut />
        <span>Logout</span>
      </button>
    </aside>
  );
}