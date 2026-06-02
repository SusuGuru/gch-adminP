import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Package, ShoppingCart, Clock, Star } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import goldCoastApiClient from '@/lib/goldCoastApiClient';

function DashboardOverview() {
  const [metrics, setMetrics] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalReviews: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [orders, products, reviews] = await Promise.all([
          goldCoastApiClient.getOrders(),
          goldCoastApiClient.getProducts(),
          goldCoastApiClient.getReviews(),
        ]);

        const pendingCount = orders.filter(order => order.status === 'pending').length;

        setMetrics({
          totalProducts: products.length,
          totalOrders: orders.length,
          pendingOrders: pendingCount,
          totalReviews: reviews.length,
        });
        setError('');
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
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
      color: 'text-blue-600',
    },
    {
      title: 'Total Orders',
      value: metrics.totalOrders,
      icon: ShoppingCart,
      color: 'text-green-600',
    },
    {
      title: 'Pending Orders',
      value: metrics.pendingOrders,
      icon: Clock,
      color: 'text-amber-600',
    },
    {
      title: 'Total Reviews',
      value: metrics.totalReviews,
      icon: Star,
      color: 'text-purple-600',
    },
  ];

  return (
    <>
      <Helmet>
        <title>GoldCoastHair-Dashboard</title>
        <meta name="description" content="Gold Coast Honey admin dashboard overview" />
      </Helmet>

      <div className="flex min-h-screen">
        <AdminSidebar />
        
        <main className="flex-1 ml-64 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>

            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {isLoading ? (
                <>
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={i}>
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <Skeleton className="h-4 w-32" />
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
                    <Card key={metric.title} className="metric-card">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          {metric.title}
                        </CardTitle>
                        <Icon className={`h-10 w-10 ${metric.color}`} />
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{metric.value}</div>
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

export default DashboardOverview;