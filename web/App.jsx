import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLoginPage from "./pages/AdminLoginPage";
import ProductsManager from "./pages/ProductsManager";
import OrdersManager from "./pages/OrdersManager";
import PromotionsManager from "./pages/PromotionsManager";
import ReviewsManager from "./pages/ReviewsManager";

import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Protected Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/products"
          element={
            <ProtectedAdminRoute>
              <ProductsManager />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <ProtectedAdminRoute>
              <OrdersManager />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/promotions"
          element={
            <ProtectedAdminRoute>
              <PromotionsManager />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/reviews"
          element={
            <ProtectedAdminRoute>
              <ReviewsManager />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;