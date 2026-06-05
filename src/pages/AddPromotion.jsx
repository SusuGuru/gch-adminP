import Sidebar from "../components/Sidebar";
import "../styles/addpromotion.css";

export default function AddPromotion() {
  return (
    <div className="dashboard">
      <Sidebar />

      <main className="add-promotion-page">
        <div className="promotion-header">
          <h1>Create Promotion</h1>
          <p>Create a discount or sales campaign.</p>
        </div>

        <div className="promotion-card">
          <form className="promotion-form">
            <div className="form-row">
              <div className="form-group">
                <label>Promotion Name</label>
                <input
                  type="text"
                  placeholder="Summer Sale"
                />
              </div>

              <div className="form-group">
                <label>Discount (%)</label>
                <input
                  type="number"
                  placeholder="20"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Start Date</label>
                <input type="date" />
              </div>

              <div className="form-group">
                <label>End Date</label>
                <input type="date" />
              </div>
            </div>

            <div className="form-group">
              <label>Status</label>

              <select>
                <option>Active</option>
                <option>Scheduled</option>
                <option>Expired</option>
              </select>
            </div>

            <div className="form-group">
              <label>Description</label>

              <textarea
                rows="5"
                placeholder="Promotion details..."
              />
            </div>

            <button
              type="submit"
              className="save-promotion-btn"
            >
              Save Promotion
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}