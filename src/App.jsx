import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import Orders from "./pages/Orders";
import Promotions from "./pages/Promotions";
import Settings from "./pages/Settings";
import AddPromotion from "./pages/AddPromotion";

function App() {
  return (
    <BrowserRouter>
      <Routes>
  <Route path="/" element={<AdminLogin />} />
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/products" element={<Products />} />
  <Route path="/add-product" element={<AddProduct />} />
  <Route path="*" element={<h1>404 Route Test</h1>} />
  <Route path="/products/edit/:id" element={<EditProduct />} />
  <Route path="/orders" element={<Orders />} />
  <Route path="/promotions" element={<Promotions />} />
<Route path="/settings" element={<Settings />} />
<Route path="/add-promotion" element={<AddPromotion />} />
</Routes>

    </BrowserRouter>
  );
}

export default App;