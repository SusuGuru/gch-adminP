import { FiTag, FiPlus } from "react-icons/fi";
import Sidebar from "../components/Sidebar";
import "../styles/promotions.css";
import { useNavigate } from "react-router-dom";

export default function Promotions() {
  const navigate = useNavigate();

const handleAddPromotion = () => {
  navigate("/add-promotion");
};

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="promotions-page">
        <div className="promotions-header">
          <div>
            <h1>Promotions</h1>
            <p>
              Manage discounts, sales, and special offers.
            </p>
          </div>

          <button
  className="add-promo-btn"
  onClick={handleAddPromotion}
>
  <FiPlus />
  Create Promotion
</button>
        </div>

        <div className="empty-promotions-card">
          <FiTag className="promo-icon" />

          <h2>No promotions found</h2>

          <p>
            Create your first promotion to start offering discounts.
          </p>

          <button className="empty-promo-btn">
            Create Promotion
          </button>
        </div>
      </main>
    </div>
  );
}