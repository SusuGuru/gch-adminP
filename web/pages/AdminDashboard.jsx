import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Package, ShoppingCart, Tag, DollarSign } from "lucide-react";
import AdminLayout from "../components/AdminLayout";

function AdminDashboard() {
  const [metrics, setMetrics] = useState({
    totalProducts: 0,
    activeOrders: 0,
    recentSales: 0,
    activePromotions: 0,
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [products, orders, promotions] = await Promise.all([
          goldCoastApiClient.getProducts().catch(() => []),
          goldCoastApiClient.getOrders().catch(() => []),
          goldCoastApiClient.getPromotions().catch(() => []),
        ]);

        setMetrics({
          totalProducts: products.length,
          activeOrders: orders.length,
          recentSales: 0,
          activePromotions: promotions.length,
        });

      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const metricCards = [
    { title: "Total Products", value: metrics.totalProducts },
    { title: "Active Orders", value: metrics.activeOrders },
    { title: "Recent Sales", value: `$${metrics.recentSales}` },
    { title: "Active Promotions", value: metrics.activePromotions },
  ];

  return (
    <AdminLayout>
      
      <Helmet>
        <title>Dashboard - Gold Coast Hair Admin</title>
      </Helmet>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {metricCards.map((m) => (
          <div key={m.title} className="bg-white p-6 rounded-xl shadow">
            <h3>{m.title}</h3>
            <div className="text-3xl font-bold">{m.value}</div>
          </div>
        ))}
      </div>

    </AdminLayout>
  );
}

export default AdminDashboard;