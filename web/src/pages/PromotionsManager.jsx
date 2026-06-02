import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Plus, Pencil, Trash2, PowerOff } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import goldCoastApiClient from '@/lib/goldCoastApiClient';

function PromotionsManager() {
  const [promotions, setPromotions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    discountType: 'percentage',
    discountValue: '',
    startDate: '',
    endDate: '',
    status: 'active'
  });

  const fetchPromotions = async () => {
    try {
      setIsLoading(true);
      const data = await goldCoastApiClient.getPromotions();
      setPromotions(data || []);
    } catch {
      toast.error('Failed to load promotions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPromotions();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleOpenDialog = (promo = null) => {
    if (promo) {
      setEditingPromo(promo);
      setFormData({
        name: promo.name || '',
        discountType: promo.discountType || 'percentage',
        discountValue: promo.discountValue?.toString() || '',
        startDate: promo.startDate ? new Date(promo.startDate).toISOString().split('T')[0] : '',
        endDate: promo.endDate ? new Date(promo.endDate).toISOString().split('T')[0] : '',
        status: promo.status || 'active'
      });
    } else {
      setEditingPromo(null);
      setFormData({
        name: '',
        discountType: 'percentage',
        discountValue: '',
        startDate: '',
        endDate: '',
        status: 'active'
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const promoData = {
        ...formData,
        discountValue: parseFloat(formData.discountValue),
      };

      if (editingPromo) {
        await goldCoastApiClient.updatePromotion(editingPromo.id, promoData);
        toast.success('Promotion updated');
      } else {
        await goldCoastApiClient.createPromotion(promoData);
        toast.success('Promotion created');
      }

      setIsDialogOpen(false);
      fetchPromotions();
    } catch (err) {
      toast.error(err.message || 'Failed to save promotion');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleStatus = async (promo) => {
    const newStatus = promo.status === 'active' ? 'inactive' : 'active';
    try {
      await goldCoastApiClient.updatePromotion(promo.id, { ...promo, status: newStatus });
      setPromotions(promotions.map(p => p.id === promo.id ? { ...p, status: newStatus } : p));
      toast.success(`Promotion ${newStatus}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this promotion?')) return;
    try {
      await goldCoastApiClient.deletePromotion(id);
      setPromotions(promotions.filter(p => p.id !== id));
      toast.success('Promotion deleted');
    } catch (error) {
      toast.error(error?.message || 'Failed to delete promotion');
    }
  };

  let promotionsContent;
  if (isLoading) {
    promotionsContent = (
      <div className="p-6 space-y-4">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full" />)}
      </div>
    );
  } else if (promotions.length === 0) {
    promotionsContent = (
      <div className="p-12 text-center">
        <p className="text-lg font-medium text-foreground">No active promotions</p>
        <Button onClick={() => handleOpenDialog()} variant="outline" className="mt-4">Create One</Button>
      </div>
    );
  } else {
    promotionsContent = (
      <div className="overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Discount</th>
              <th>Valid Dates</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {promotions.map((promo) => (
              <tr key={promo.id} className={promo.status === 'inactive' ? 'opacity-60' : ''}>
                <td className="font-medium text-foreground">{promo.name}</td>
                <td>
                  {promo.discountType === 'percentage' ? `${promo.discountValue}%` : `$${promo.discountValue}`} off
                </td>
                <td className="text-sm text-muted-foreground">
                  {new Date(promo.startDate).toLocaleDateString()} - {new Date(promo.endDate).toLocaleDateString()}
                </td>
                <td>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    promo.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {promo.status.toUpperCase()}
                  </span>
                </td>
                <td>
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => toggleStatus(promo)} title={promo.status === 'active' ? 'Deactivate' : 'Activate'}>
                      <PowerOff className={`h-4 w-4 ${promo.status === 'active' ? 'text-amber-500' : 'text-green-500'}`} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(promo)}>
                      <Pencil className="h-4 w-4 text-muted-foreground hover:text-primary" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(promo.id)}>
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Promotions - Gold Coast Hair Admin</title>
      </Helmet>

      <div className="flex min-h-screen bg-muted/30">
        <AdminSidebar />
        
        <main className="flex-1 ml-64 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-heading font-bold text-foreground">Promotions</h1>
                <p className="text-muted-foreground mt-1">Manage discounts and special offers.</p>
              </div>
              <Button onClick={() => handleOpenDialog()} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="h-4 w-4 mr-2" />
                Create Promotion
              </Button>
            </div>

            <div className="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden">
              {promotionsContent}
            </div>
          </div>
        </main>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">
              {editingPromo ? 'Edit Promotion' : 'Create Promotion'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Promotion Name</Label>
              <Input id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Discount Type</Label>
                <Select value={formData.discountType} onValueChange={v => setFormData({...formData, discountType: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="value">Value</Label>
                <Input id="value" type="number" step="0.01" min="0" value={formData.discountValue} onChange={e => setFormData({...formData, discountValue: e.target.value})} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start">Start Date</Label>
                <Input id="start" type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end">End Date</Label>
                <Input id="end" type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} required />
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isSaving} className="bg-primary text-primary-foreground">
                {isSaving ? 'Saving...' : 'Save Promotion'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default PromotionsManager;