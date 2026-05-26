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
import { Loader2Icon } from "lucide-react";
import type { IProduct, ProductForm } from "@/types/Product.type";
import type { ICategory } from "@/types/Category.type";
import type { ISubCategory } from "@/types/SubCategory.type";
import type { IUnit } from "@/types/Unit.type";

interface ProductFormDialogProps {
  open: boolean;
  mode: "create" | "edit";
  product?: IProduct | null;
  categories: ICategory[];
  subCategories: ISubCategory[];
  units: IUnit[];
  loading?: boolean;
  onSubmit: (data: ProductForm) => void;
  onClose: () => void;
}

export function ProductFormDialog({
  open,
  mode,
  product,
  categories,
  subCategories,
  units,
  loading = false,
  onSubmit,
  onClose,
}: ProductFormDialogProps) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [otherName, setOtherName] = useState("");
  const [salePrice, setSalePrice] = useState<number | "">("");
  const [costPrice, setCostPrice] = useState<number | "">("");
  const [taxMethod, setTaxMethod] = useState("1");
  const [barCodeSymbology, setBarCodeSymbology] = useState("CODE128");
  const [type, setType] = useState("STANDARD");
  const [details, setDetails] = useState("");
  const [alertQuantity, setAlertQuantity] = useState<number | "">("");
  const [unitId, setUnitId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState("ACTIVE");

  // Sync inputs on open/change
  useEffect(() => {
    if (open) {
      if (mode === "edit" && product) {
        setCode(product.code || "");
        setName(product.name || "");
        setOtherName(product.otherName || "");
        setSalePrice(product.salePrice !== undefined ? Number(product.salePrice) : "");
        setCostPrice(product.costPrice !== undefined ? Number(product.costPrice) : "");
        setTaxMethod(product.taxMethod ? String(product.taxMethod) : "1");
        setBarCodeSymbology(product.barCodeSymbology || "CODE128");
        setType(product.type || "STANDARD");
        setDetails(product.details || "");
        setAlertQuantity(product.alertQuantity !== undefined ? Number(product.alertQuantity) : "");
        setUnitId(product.unitId ? String(product.unitId) : "");
        setCategoryId(product.categoryId ? String(product.categoryId) : "");
        setSubCategoryId(product.subCategoryId ? String(product.subCategoryId) : "");
        setImageUrl(product.imageUrl || "");
        setStatus(product.status || "ACTIVE");
      } else {
        setCode("");
        setName("");
        setOtherName("");
        setSalePrice("");
        setCostPrice("");
        setTaxMethod("1");
        setBarCodeSymbology("CODE128");
        setType("STANDARD");
        setDetails("");
        setAlertQuantity("");
        setUnitId("");
        setCategoryId("");
        setSubCategoryId("");
        setImageUrl("");
        setStatus("ACTIVE");
      }
    }
  }, [open, mode, product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim() || salePrice === "" || costPrice === "" || !unitId || !categoryId) return;

    const formData: ProductForm = {
      code: code.trim(),
      name: name.trim(),
      otherName: otherName.trim() || undefined,
      salePrice: Number(salePrice),
      costPrice: Number(costPrice),
      taxMethod: Number(taxMethod),
      barCodeSymbology,
      type,
      details: details.trim() || undefined,
      alertQuantity: alertQuantity !== "" ? Number(alertQuantity) : undefined,
      unitId: Number(unitId),
      categoryId: Number(categoryId),
      subCategoryId: subCategoryId ? Number(subCategoryId) : 0,
      imageUrl: imageUrl.trim() || undefined,
      status,
    };

    onSubmit(formData);
  };

  // Reactive subcategories matching selected Category
  const filteredSubCategories = subCategories.filter(
    (sub) => sub.categoryId === Number(categoryId)
  );

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add New Product" : "Edit Product"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Register a new stock inventory item in your system."
              : "Update product pricing, images and metrics."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 overflow-y-auto max-h-[70vh] pr-2 pt-2">
          {/* General Information Card */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="prod-code">Code / SKU</Label>
              <Input
                id="prod-code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. PROD-001"
                required
                disabled={loading}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="prod-name">Name</Label>
              <Input
                id="prod-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Wireless Mouse"
                required
                disabled={loading}
              />
            </div>
            <div className="flex flex-col gap-2 col-span-2">
              <Label htmlFor="prod-other">Alternate Name / Alias (Optional)</Label>
              <Input
                id="prod-other"
                value={otherName}
                onChange={(e) => setOtherName(e.target.value)}
                placeholder="e.g. Mouse Blue"
                disabled={loading}
              />
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-2 gap-4 border border-border/60 bg-muted/20 p-3 rounded-lg">
            <div className="flex flex-col gap-2">
              <Label htmlFor="prod-sale">Sale Price ($)</Label>
              <Input
                id="prod-sale"
                type="number"
                step="0.01"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="e.g. 19.99"
                required
                disabled={loading}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="prod-cost">Cost Price ($)</Label>
              <Input
                id="prod-cost"
                type="number"
                step="0.01"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="e.g. 10.00"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Catalog & Scale Selectors */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="prod-unit">Measurement Unit</Label>
              <Select value={unitId} onValueChange={setUnitId} disabled={loading}>
                <SelectTrigger id="prod-unit">
                  <SelectValue placeholder="Select Unit" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((u) => (
                    <SelectItem key={u.id} value={String(u.id)}>
                      {u.name} ({u.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="prod-cat">Category</Label>
              <Select
                value={categoryId}
                onValueChange={(val) => {
                  setCategoryId(val);
                  setSubCategoryId(""); // Reset subcategory when category changes
                }}
                disabled={loading}
              >
                <SelectTrigger id="prod-cat">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="prod-subcat">Subcategory</Label>
              <Select
                value={subCategoryId}
                onValueChange={setSubCategoryId}
                disabled={loading || !categoryId}
              >
                <SelectTrigger id="prod-subcat">
                  <SelectValue placeholder="Select Subcat" />
                </SelectTrigger>
                <SelectContent>
                  {filteredSubCategories.length === 0 ? (
                    <SelectItem value="NONE" disabled>No Subcategories</SelectItem>
                  ) : (
                    filteredSubCategories.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>
                        {s.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Details / image */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="prod-image">Image URL</Label>
            <Input
              id="prod-image"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="e.g. https://example.com/image.png"
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="prod-alert">Stock Alert Threshold Quantity</Label>
              <Input
                id="prod-alert"
                type="number"
                value={alertQuantity}
                onChange={(e) => setAlertQuantity(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="e.g. 5"
                disabled={loading}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="prod-status">Status</Label>
              <Select value={status} onValueChange={setStatus} disabled={loading}>
                <SelectTrigger id="prod-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="prod-details">Product Details</Label>
            <Textarea
              id="prod-details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Additional product details, description or specifications..."
              className="resize-none"
              rows={3}
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
              disabled={loading || !name.trim() || !code.trim() || salePrice === "" || costPrice === "" || !unitId || !categoryId}
            >
              {loading && <Loader2Icon className="mr-2 size-4 animate-spin" />}
              {mode === "create" ? "Create" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
