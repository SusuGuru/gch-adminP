import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Plus, Pencil, Trash2, Image as ImageIcon, Package } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import goldCoastApiClient from '@/lib/goldCoastApiClient';

function ProductsManager() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stockStatus: 'in_stock'
  });
  const [imageFile, setImageFile] = useState(null);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const data = await goldCoastApiClient.getProducts();
      setProducts(data || []);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const data = await goldCoastApiClient.getProducts();
        if (isMounted) {
          setProducts(data || []);
        }
      } catch {
        toast.error('Failed to load products');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  function handleOpenDialog(product = null) {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name || '',
                description: product.description || '',
                price: product.price?.toString() || '',
                category: product.category || '',
                stockStatus: product.stockStatus || 'in_stock'
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                description: '',
                price: '',
                category: '',
                stockStatus: 'in_stock'
            });
        }
        setImageFile(null);
        setIsDialogOpen(true);
    }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        stockStatus: formData.stockStatus
      };

      let savedProduct;
      if (editingProduct) {
        savedProduct = await goldCoastApiClient.updateProduct(editingProduct.id, productData);
        toast.success('Product updated successfully');
      } else {
        savedProduct = await goldCoastApiClient.createProduct(productData);
        toast.success('Product created successfully');
      }

      if (imageFile && savedProduct?.id) {
        await goldCoastApiClient.uploadProductImage(savedProduct.id, imageFile);
        toast.success('Image uploaded successfully');
      }

      setIsDialogOpen(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.message || 'Failed to save product');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteProductId) return;
    try {
      await goldCoastApiClient.deleteProduct(deleteProductId);
      setProducts(products.filter(p => p.id !== deleteProductId));
      toast.success('Product deleted');
    } catch {
      toast.error('Failed to delete product');
    } finally {
      setDeleteProductId(null);
    }
  };

  const toggleStock = async (product) => {
    const newStatus = product.stockStatus === 'in_stock' ? 'out_of_stock' : 'in_stock';
    try {
      await goldCoastApiClient.updateProduct(product.id, { ...product, stockStatus: newStatus });
      setProducts(products.map(p => p.id === product.id ? { ...p, stockStatus: newStatus } : p));
      toast.success(`Stock status updated to ${newStatus.replace('_', ' ')}`);
    } catch (err) {
      toast.error(err.message || 'Failed to update stock status');
    }
  };

  return (
    <>
      <Helmet>
        <title>Products - Gold Coast Hair Admin</title>
      </Helmet>

      <div className="flex min-h-screen bg-muted/30">
        <AdminSidebar />
        
        <main className="flex-1 ml-64 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-heading font-bold text-foreground">Products</h1>
                <p className="text-muted-foreground mt-1">Manage your luxury hair extensions and products.</p>
              </div>
              <Button onClick={() => handleOpenDialog()} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>

            <div className="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden">
              {isLoading && (
                <div className="p-6 space-y-4">
                  {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-16 w-full" />)}
                </div>
              )}
              {!isLoading && products.length === 0 && (
                <div className="p-12 text-center">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium text-foreground">No products found</p>
                  <p className="text-muted-foreground mb-4">Get started by adding your first product.</p>
                  <Button onClick={() => handleOpenDialog()} variant="outline">Add Product</Button>
                </div>
              )}
              {!isLoading && products.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th className="text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td className="font-medium text-foreground">{product.name}</td>
                          <td className="capitalize">{product.category}</td>
                          <td>${product.price?.toFixed(2)}</td>
                          <td>
                            <button 
                              onClick={() => toggleStock(product)}
                              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                                product.stockStatus === 'in_stock' 
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                  : 'bg-red-100 text-red-800 hover:bg-red-200'
                              }`}
                            >
                              {product.stockStatus === 'in_stock' ? 'In Stock' : 'Out of Stock'}
                            </button>
                          </td>
                          <td>
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(product)}>
                                <Pencil className="h-4 w-4 text-muted-foreground hover:text-primary" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => setDeleteProductId(product.id)}>
                                <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input id="price" type="number" step="0.01" min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={v => setFormData({...formData, category: v})}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="extensions">Extensions</SelectItem>
                    <SelectItem value="wigs">Wigs</SelectItem>
                    <SelectItem value="accessories">Accessories</SelectItem>
                    <SelectItem value="care">Hair Care</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Product Image</Label>
              <div className="flex items-center gap-4">
                <Input id="image" type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="flex-1" />
                {imageFile && <ImageIcon className="h-5 w-5 text-primary" />}
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isSaving} className="bg-primary text-primary-foreground">
                {isSaving ? 'Saving...' : 'Save Product'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteProductId} onOpenChange={() => setDeleteProductId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default ProductsManager;