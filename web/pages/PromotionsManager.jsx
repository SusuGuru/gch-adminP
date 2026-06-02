import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Plus, Pencil, Trash2, PowerOff } from "lucide-react";

import AdminLayout from "../components/AdminLayout";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
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

import goldCoastApiClient from "@/lib/goldCoastApiClient";

function PromotionsManager() {
  const [promotions, setPromotions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    discountType: "percentage",
    discountValue: "",
    startDate: "",
    endDate: "",
    status: "active",
  });

  const fetchPromotions = async () => {
    try {
      setIsLoading(true);
      const data = await goldCoastApiClient.getPromotions();
      setPromotions(data || []);
    } catch {
      toast.error("Failed to load promotions");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleOpenDialog = (promo = null) => {
    if (promo) {
      setEditingPromo(promo);
      setFormData({
        name: promo.name || "",
        discountType: promo.discountType || "percentage",
        discountValue: promo.discountValue?.toString() || "",
        startDate: promo.startDate
          ? new Date(promo.startDate).toISOString().split("T")[0]
          : "",
        endDate: promo.endDate
          ? new Date(promo.endDate).toISOString().split("T")[0]
          : "",
        status: promo.status || "active",
      });
    } else {
      setEditingPromo(null);
      setFormData({
        name: "",
        discountType: "percentage",
        discountValue: "",
        startDate: "",
        endDate: "",
        status: "active",
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
        await goldCoastApiClient.updatePromotion(
          editingPromo.id,
          promoData
        );
        toast.success("Promotion updated");
      } else {
        await goldCoastApiClient.createPromotion(promoData);
        toast.success("Promotion created");
      }

      setIsDialogOpen(false);
      fetchPromotions();
    } catch (err) {
      toast.error(err.message || "Failed to save promotion");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleStatus = async (promo) => {
    const newStatus =
      promo.status === "active" ? "inactive" : "active";

    try {
      await goldCoastApiClient.updatePromotion(promo.id, {
        ...promo,
        status: newStatus,
      });

      setPromotions((prev) =>
        prev.map((p) =>
          p.id === promo.id ? { ...p, status: newStatus } : p
        )
      );

      toast.success(`Promotion ${newStatus}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this promotion?")) return;

    try {
      await goldCoastApiClient.deletePromotion(id);
      setPromotions((prev) => prev.filter((p) => p.id !== id));
      toast.success("Promotion deleted");
    } catch (error) {
      toast.error(error?.message || "Failed to delete promotion");
    }
  };

  let promotionsContent;

  if (isLoading) {
    promotionsContent = (
      <div className="p-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  } else if (promotions.length === 0) {
    promotionsContent = (
      <div className="p-12 text-center">
        <p className="text-lg font-medium">No active promotions</p>
        <Button
          onClick={() => handleOpenDialog()}
          className="mt-4"
        >
          Create One
        </Button>
      </div>
    );
  } else {
    promotionsContent = (
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Discount</th>
            <th className="p-3 text-left">Dates</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {promotions.map((promo) => (
            <tr
              key={promo.id}
              className={promo.status === "inactive" ? "opacity-60" : ""}
            >
              <td className="p-3 font-medium">{promo.name}</td>

              <td className="p-3">
                {promo.discountType === "percentage"
                  ? `${promo.discountValue}%`
                  : `$${promo.discountValue}`}{" "}
                off
              </td>

              <td className="p-3 text-sm text-gray-500">
                {new Date(promo.startDate).toLocaleDateString()} -{" "}
                {new Date(promo.endDate).toLocaleDateString()}
              </td>

              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    promo.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {promo.status}
                </span>
              </td>

              <td className="p-3 text-right space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleStatus(promo)}
                >
                  <PowerOff className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleOpenDialog(promo)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(promo.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <AdminLayout>
      <Helmet>
        <title>Promotions - Gold Coast Admin</title>
      </Helmet>

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Promotions</h1>
            <p className="text-gray-500">
              Manage discounts and special offers
            </p>
          </div>

          <Button onClick={() => handleOpenDialog()}>
            <Plus className="w-4 h-4 mr-2" />
            Create Promotion
          </Button>
        </div>

        <div className="bg-white border rounded-lg overflow-hidden">
          {promotionsContent}
        </div>
      </div>

      {/* Dialog stays unchanged */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingPromo
                ? "Edit Promotion"
                : "Create Promotion"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

export default PromotionsManager;