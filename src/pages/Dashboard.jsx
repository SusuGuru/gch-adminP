import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";

import {
  FiBox,
  FiShoppingCart,
  FiDollarSign,
  FiTag,
} from "react-icons/fi";

import "../styles/dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard">
      <Sidebar />

      <main className="dashboard-content">
        <h1>Dashboard Overview</h1>

        <p className="dashboard-subtitle">
          Welcome back to the Gold Coast Hair admin portal.
        </p>

        <div className="stats-grid">
          <StatCard
            title="Total Products"
            value="0"
            icon={<FiBox />}
          />

          <StatCard
            title="Active Orders"
            value="0"
            icon={<FiShoppingCart />}
          />

          <StatCard
            title="Recent Sales"
            value="$0.00"
            icon={<FiDollarSign />}
          />

          <StatCard
            title="Active Promotions"
            value="0"
            icon={<FiTag />}
          />
        </div>
      </main>
    </div>
  );
}