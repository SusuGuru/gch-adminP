import Sidebar from "../components/Sidebar";

export default function AddProduct() {
  return (
    <div className="dashboard">
      <Sidebar />

      <main className="products-page">
        <h1>Add Product</h1>
        <p>This is where the product form will go.</p>
      </main>
    </div>
  );
}