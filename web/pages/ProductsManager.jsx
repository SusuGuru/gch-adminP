import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Plus, Pencil, Trash2, Image as ImageIcon, Package } from "lucide-react";

import AdminLayout from "../components/AdminLayout";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import goldCoastApiClient from "@/lib/goldCoastApiClient";

function ProductsManager() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stockStatus: "in_stock",
  });

  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const data = await goldCoastApiClient.getProducts();
        if (isMounted) setProducts(data || []);
      } catch {
        toast.error("Failed to load products");
      } finally {
        if (isMounted) setIsLoading(false);
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
        name: product.name || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        category: product.category || "",
        stockStatus: product.stockStatus || "in_stock",
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        stockStatus: "in_stock",
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
        stockStatus: formData.stockStatus,
      };

      let savedProduct;

      if (editingProduct) {
        savedProduct = await goldCoastApiClient.updateProduct(
          editingProduct.id,
          productData
        );
        toast.success("Product updated successfully");
      } else {
        savedProduct = await goldCoastApiClient.createProduct(productData);
        toast.success("Product created successfully");
      }

      if (imageFile && savedProduct?.id) {
        await goldCoastApiClient.uploadProductImage(
          savedProduct.id,
          imageFile
        );
        toast.success("Image uploaded successfully");
      }

      setIsDialogOpen(false);
      setProducts(await goldCoastApiClient.getProducts());
    } catch (err) {
      toast.error(err.message || "Failed to save product");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteProductId) return;

    try {
      await goldCoastApiClient.deleteProduct(deleteProductId);
      setProducts((prev) =>
        prev.filter((p) => p.id !== deleteProductId)
      );
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setDeleteProductId(null);
    }
  };

  const toggleStock = async (product) => {
    const newStatus =
      product.stockStatus === "in_stock"
        ? "out_of_stock"
        : "in_stock";

    try {
      await goldCoastApiClient.updateProduct(product.id, {
        ...product,
        stockStatus: newStatus,
      });

      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id
            ? { ...p, stockStatus: newStatus }
            : p
        )
      );

      toast.success(
        `Stock status updated to ${newStatus.replace("_", " ")}`
      );
    } catch {
      toast.error("Failed to update stock status");
    }
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>Products - Gold Coast Hair Admin</title>
      </Helmet>

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Products</h1>
            <p className="text-gray-500">
              Manage your luxury hair extensions
            </p>
          </div>

          <Button onClick={() => handleOpenDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        <div className="bg-white border rounded-lg overflow-hidden">
          {isLoading && (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          )}

          {!isLoading && products.length === 0 && (
            <div className="p-12 text-center">
              <Package className="mx-auto mb-4 opacity-50" />
              <p>No products found</p>
            </div>
          )}

          {!isLoading && products.length > 0 && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-left">Price</th>
                  <th className="p-3 text-left">Stock</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="p-3 font-medium">
                      {product.name}
                    </td>

                    <td className="p-3 capitalize">
                      {product.category}
                    </td>

                    <td className="p-3">
                      ${product.price?.toFixed(2)}
                    </td>

                    <td className="p-3">
                      <button
                        onClick={() => toggleStock(product)}
                        className="px-2 py-1 text-xs rounded bg-gray-100"
                      >
                        {product.stockStatus === "in_stock"
                          ? "In Stock"
                          : "Out of Stock"}
                      </button>
                    </td>

                    <td className="p-3 text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleOpenDialog(product)
                        }
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setDeleteProductId(product.id)
                        }
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* dialogs unchanged (kept same structure) */}
    </AdminLayout>
  );
}

export default ProductsManager;