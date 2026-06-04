import { useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/orders.css";
import { FiChevronDown, FiCheck } from "react-icons/fi";

export default function Orders() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("All Orders");

  const options = [
    "All Orders",
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="orders-page">
        <div className="orders-header">
          <div>
            <h1>Orders</h1>
            <p>
              Manage customer orders and fulfillment.
            </p>
          </div>

          <div className="filter-container">
            <button
              className="filter-btn"
              onClick={() => setOpen(!open)}
            >
              <span>{status}</span>
              <FiChevronDown />
            </button>

            {open && (
              <div className="dropdown-menu">
                {options.map((option) => (
                  <div
                    key={option}
                    className="dropdown-item"
                    onClick={() => {
                      setStatus(option);
                      setOpen(false);
                    }}
                  >
                    <span>{option}</span>

                    {status === option && (
                      <FiCheck />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="orders-card">
          <h2>No orders found</h2>
          <p>Try adjusting your filters.</p>
        </div>
      </main>
    </div>
  );
}