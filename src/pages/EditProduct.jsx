import Sidebar from "../components/Sidebar";
import "../styles/editproduct.css";

export default function EditProduct() {
  return (
    <div className="dashboard">
      <Sidebar />

      <main className="edit-product-page">
        <div className="page-header">
          <h1>Edit Product</h1>
          <p>Update product information.</p>
        </div>

        <div className="edit-product-card">
          <form className="edit-product-form">
            <div className="form-row">
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  defaultValue="Raw Cambodian Body Wave"
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  defaultValue="Raw Hair"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Price</label>
                <input
                  type="number"
                  defaultValue="350"
                />
              </div>

              <div className="form-group">
                <label>Stock Quantity</label>
                <input
                  type="number"
                  defaultValue="20"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>

              <textarea
                rows="6"
                defaultValue="Premium raw Cambodian hair extensions."
              />
            </div>

            <div className="form-group">
              <label>Replace Product Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
              />
            </div>

            <div className="action-buttons">
              <button
                type="submit"
                className="save-btn"
              >
                Update Product
              </button>

              <button
                type="button"
                className="delete-btn"
              >
                Delete Product
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}