import { FiBox, FiPlus } from "react-icons/fi";
import Sidebar from "../components/Sidebar";
import "../styles/products.css";
import { useNavigate } from "react-router-dom";

export default function Products() {
  const navigate = useNavigate();

  const handleAddProduct = () => {
  console.log("Button clicked");
  navigate("/add-product");
};

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="products-page">
        <div className="products-header">
          <div>
            <h1>Products</h1>

            <p>
              Manage your luxury hair extensions and products.
            </p>
          </div>

          <button className="add-product-btn" onClick={handleAddProduct}>
            <FiPlus />
            Add Product
          </button>
        </div>

        <div className="empty-products-card">
          <FiBox className="empty-icon" />

          <h2>No products found</h2>

          <p>
            Get started by adding your first product.
          </p>

          <button className="empty-add-btn" onClick={handleAddProduct}>
            Add Product
          </button>
        </div>
      </main>
    </div>
  );
}