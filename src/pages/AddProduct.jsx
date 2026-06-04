import Sidebar from "../components/Sidebar";
import "../styles/addproduct.css";

export default function AddProduct() {
  return (
    <div className="dashboard">
      <Sidebar />

      <main className="add-product-page">
        <div className="page-header">
          <div>
            <h1>Add Product</h1>
            <p>Create a new product for Gold Coast Hair.</p>
          </div>
        </div>

        <div className="product-form-card">
          <form className="product-form">
            <div className="form-row">
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  placeholder="Enter product name"
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  placeholder="Raw Hair, Wigs, Bundles..."
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Price</label>
                <input
                  type="number"
                  placeholder="0.00"
                />
              </div>

              <div className="form-group">
                <label>Sale Price</label>
                <input
                  type="number"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Length</label>
                <input
                  type="text"
                  placeholder="24 inches"
                />
              </div>

              <div className="form-group">
                <label>Texture</label>
                <input
                  type="text"
                  placeholder="Body Wave"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Color</label>
                <input
                  type="text"
                  placeholder="Natural Black"
                />
              </div>

              <div className="form-group">
                <label>Stock Quantity</label>
                <input
                  type="number"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>

              <textarea
                rows="6"
                placeholder="Enter product description..."
              />
            </div>

            <div className="form-group">
              <label>Product Images</label>

              <input
                type="file"
                accept="image/*"
                multiple
              />
            </div>

            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="featured"
              />

              <label htmlFor="featured">
                Featured Product
              </label>
            </div>

            <button
              type="submit"
              className="save-product-btn"
            >
              Save Product
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}