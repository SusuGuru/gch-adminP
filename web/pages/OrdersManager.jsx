import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Eye } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar.jsx';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import goldCoastApiClient from '@/lib/goldCoastApiClient';

function OrdersManager() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const data = await goldCoastApiClient.getOrders();
        setOrders(data || []);
      } catch {
        toast.error('Failed to load orders');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await goldCoastApiClient.updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      toast.success('Order status updated');
    } catch {
      toast.error('Failed to update order status');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(o => o.status === statusFilter);

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Helmet>
        <title>Orders - Gold Coast Hair Admin</title>
      </Helmet>

      <div className="flex min-h-screen bg-muted/30">
        <AdminSidebar />
        
        <main className="flex-1 ml-64 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-heading font-bold text-foreground">Orders</h1>
                <p className="text-muted-foreground mt-1">Manage customer orders and fulfillment.</p>
              </div>
              <div className="flex items-center gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px] bg-card">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Orders</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden">
              {(() => {
                if (isLoading) {
                  return (
                    <div className="p-6 space-y-4">
                      {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-16 w-full" />)}
                    </div>
                  );
                }

                if (filteredOrders.length === 0) {
                  return (
                    <div className="p-12 text-center">
                      <p className="text-lg font-medium text-foreground">No orders found</p>
                      <p className="text-muted-foreground">Try adjusting your filters.</p>
                    </div>
                  );
                }

                return (
                  <div className="overflow-x-auto">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Customer</th>
                          <th>Date</th>
                          <th>Total</th>
                          <th>Status</th>
                          <th className="text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.map((order) => (
                          <tr key={order.id}>
                            <td className="font-mono text-xs text-muted-foreground">#{order.id.slice(0,8)}</td>
                            <td className="font-medium text-foreground">{order.customerName || 'Guest'}</td>
                            <td>{new Date(order.createdAt || new Date()).toLocaleDateString()}</td>
                            <td className="font-semibold">${order.total?.toFixed(2)}</td>
                            <td>
                              <Select value={order.status} onValueChange={(v) => handleStatusChange(order.id, v)}>
                                <SelectTrigger className={`h-8 w-[130px] text-xs border-0 ${getStatusColor(order.status)}`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="processing">Processing</SelectItem>
                                  <SelectItem value="shipped">Shipped</SelectItem>
                                  <SelectItem value="delivered">Delivered</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                            <td>
                              <div className="flex justify-end">
                                <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order)}>
                                  <Eye className="h-4 w-4 mr-2" /> View
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })()}
            </div>
          </div>
        </main>
      </div>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl flex items-center justify-between">
              <span>Order Details</span>
              <span className="text-sm font-mono text-muted-foreground font-normal">#{selectedOrder?.id}</span>
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Customer</h4>
                  <p className="text-muted-foreground">{selectedOrder.customerName}</p>
                  <p className="text-muted-foreground">{selectedOrder.customerEmail}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Shipping Address</h4>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {selectedOrder.shippingAddress || 'No address provided'}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-3 border-b pb-2">Items</h4>
                <div className="space-y-3">
                  {(selectedOrder.items || []).map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <div className="flex gap-3">
                        <span className="text-muted-foreground">{item.quantity}x</span>
                        <span className="font-medium">{item.productName}</span>
                      </div>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <span className="font-semibold text-foreground">Total</span>
                <span className="text-xl font-bold text-primary">${selectedOrder.total?.toFixed(2)}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default OrdersManager;