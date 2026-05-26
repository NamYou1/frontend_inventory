import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2Icon, ClipboardEditIcon } from "lucide-react";
import type { IProduct } from "@/types/Product.type";
import type { IStore } from "@/types/Store.type";

interface AdjustmentFormDialogProps {
  open: boolean;
  stores: IStore[];
  products: IProduct[];
  loading?: boolean;
  onSubmit: (data: any) => void;
  onClose: () => void;
}

export function AdjustmentFormDialog({
  open,
  stores,
  products,
  loading = false,
  onSubmit,
  onClose,
}: AdjustmentFormDialogProps) {
  const [storeId, setStoreId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [adjustmentType, setAdjustmentType] = useState("INCREASE");
  const [reason, setReason] = useState("");

  // Reset inputs on modal toggle
  useEffect(() => {
    if (open) {
      setStoreId("");
      setProductId("");
      setQuantity("");
      setAdjustmentType("INCREASE");
      setReason("");
    }
  }, [open]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeId || !productId || !quantity || quantity <= 0) return;

    onSubmit({
      productId: Number(productId),
      storeId: Number(storeId),
      quantity: Number(quantity),
      adjustmentType,
      reason: reason.trim(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[500px] overflow-hidden rounded-xl border border-border/80 bg-background/95 backdrop-blur-md shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <ClipboardEditIcon className="size-5 text-primary" />
            Add Stock Adjustment
          </DialogTitle>
          <DialogDescription>
            Register a manual stock adjustment order to reconcile physical inventory counts.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 pt-2">
          {/* Store Outlet Selection */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="adj-store">Store Outlet *</Label>
            <Select value={storeId} onValueChange={setStoreId} disabled={loading}>
              <SelectTrigger id="adj-store">
                <SelectValue placeholder="Select Store Outlet" />
              </SelectTrigger>
              <SelectContent>
                {stores.map((s) => (
                  <SelectItem key={s.id} value={String(s.id)}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Product Selection */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="adj-product">Product *</Label>
            <Select value={productId} onValueChange={setProductId} disabled={loading}>
              <SelectTrigger id="adj-product">
                <SelectValue placeholder="Select Product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((p) => (
                  <SelectItem key={p.id} value={String(p.id)}>
                    {p.name} ({p.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Quantity */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="adj-quantity">Quantity *</Label>
              <Input
                id="adj-quantity"
                type="number"
                min="1"
                placeholder="e.g. 10"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value === "" ? "" : Number(e.target.value))}
                disabled={loading}
                required
              />
            </div>

            {/* Type selection */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="adj-type">Adjustment Type *</Label>
              <Select value={adjustmentType} onValueChange={setAdjustmentType} disabled={loading}>
                <SelectTrigger id="adj-type">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INCREASE">Stock In (Increase)</SelectItem>
                  <SelectItem value="DECREASE">Stock Out (Decrease)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Reason text */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="adj-reason">Reason for Adjustment</Label>
            <Textarea
              id="adj-reason"
              placeholder="e.g. Reconcile damaged items, physical count discrepancy..."
              className="resize-none"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Dialog Action Footers */}
          <DialogFooter className="gap-2 pt-2 border-t border-border/40 mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !storeId || !productId || !quantity || quantity <= 0}
            >
              {loading && <Loader2Icon className="mr-2 size-4 animate-spin" />}
              Submit Adjustment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
