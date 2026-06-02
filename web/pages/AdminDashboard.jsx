import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Package, ShoppingCart, Tag, DollarSign } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import goldCoastApiClient from '@/lib/goldCoastApiClient';

function AdminDashboard() {
  const [metrics, setMetrics] = useState({
    totalProducts: 0,
    activeOrders: 0,
    recentSales: 0,
    activePromotions: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [products, orders, promotions] = await Promise.all([
          goldCoastApiClient.getProducts().catch(() => []),
          goldCoastApiClient.getOrders().catch(() => []),
          goldCoastApiClient.getPromotions().catch(() => []),
        ]);

        const activeOrdersCount = orders.filter(o => ['pending', 'processing'].includes(o.status)).length;
        const recentSalesTotal = orders
          .filter(o => o.status !== 'cancelled')
          .reduce((sum, order) => sum + (order.total || 0), 0);
        const activePromosCount = promotions.filter(p => p.status === 'active').length;

        setMetrics({
          totalProducts: products.length,
          activeOrders: activeOrdersCount,
          recentSales: recentSalesTotal,
          activePromotions: activePromosCount,
        });
        setError('');
      } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
    };

    fetchData();
  }, []);

  const metricCards = [
    {
      title: 'Total Products',
      value: metrics.totalProducts,
      icon: Package,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      title: 'Active Orders',
      value: metrics.activeOrders,
      icon: ShoppingCart,
      color: 'text-secondary',
      bg: 'bg-secondary/10',
    },
    {
      title: 'Recent Sales',
      value: `$${metrics.recentSales.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-green-600',
      bg: 'bg-green-600/10',
    },
    {
      title: 'Active Promotions',
      value: metrics.activePromotions,
      icon: Tag,
      color: 'text-purple-600',
      bg: 'bg-purple-600/10',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Dashboard - Gold Coast Hair Admin</title>
      </Helmet>

      <div className="flex min-h-screen bg-muted/30">
        <AdminSidebar />
        
        <main className="flex-1 ml-64 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-heading font-bold text-foreground">Dashboard Overview</h1>
              <p className="text-muted-foreground mt-1">Welcome back to the Gold Coast Hair admin portal.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {isLoading ? (
                <>
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="border-border/50">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-10 rounded-full" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-8 w-20" />
                      </CardContent>
                    </Card>
                  ))}
                </>
              ) : (
                metricCards.map((metric) => {
                  const Icon = metric.icon;
                  return (
                    <Card key={metric.title} className="metric-card border-border/50">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          {metric.title}
                        </CardTitle>
                        <div className={`p-2 rounded-full ${metric.bg}`}>
                          <Icon className={`h-5 w-5 ${metric.color}`} />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-foreground">{metric.value}</div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default AdminDashboard;