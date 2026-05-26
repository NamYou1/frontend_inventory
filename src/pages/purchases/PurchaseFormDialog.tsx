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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2Icon, Trash2Icon, PlusIcon, ShoppingBagIcon } from "lucide-react";
import type { IProduct } from "@/types/Product.type";
import type { IStore } from "@/types/Store.type";
import type { ISupplier } from "@/types/Supplier.type";
import type { ISeller } from "@/types/Seller.type";
import type { IPurchaseItem } from "@/types/Purchase.type";

interface PurchaseFormDialogProps {
  open: boolean;
  stores: IStore[];
  suppliers: ISupplier[];
  sellers: ISeller[];
  products: IProduct[];
  loading?: boolean;
  onSubmit: (data: any) => void;
  onClose: () => void;
}

export function PurchaseFormDialog({
  open,
  stores,
  suppliers,
  sellers,
  products,
  loading = false,
  onSubmit,
  onClose,
}: PurchaseFormDialogProps) {
  const [supplierId, setSupplierId] = useState("");
  const [storeId, setStoreId] = useState("");
  const [sellerId, setSellerId] = useState("");
  const [totalDiscount, setTotalDiscount] = useState<number>(0);

  // Dynamic cart states
  const [cartItems, setCartItems] = useState<IPurchaseItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [inputQuantity, setInputQuantity] = useState<number | "">("");
  const [inputUnitPrice, setInputUnitPrice] = useState<number | "">("");

  // Clear/reset state on open
  useEffect(() => {
    if (open) {
      setSupplierId("");
      setStoreId("");
      setSellerId("");
      setTotalDiscount(0);
      setCartItems([]);
      setSelectedProductId("");
      setInputQuantity("");
      setInputUnitPrice("");
    }
  }, [open]);

  // Autofill unit price when product is selected in cart
  const handleProductSelect = (prodId: string) => {
    setSelectedProductId(prodId);
    const prod = products.find((p) => p.id === Number(prodId));
    if (prod) {
      setInputUnitPrice(prod.costPrice || 0);
    }
  };

  const handleAddItem = () => {
    if (!selectedProductId || !inputQuantity || inputQuantity <= 0 || !inputUnitPrice || inputUnitPrice < 0) return;

    const prod = products.find((p) => p.id === Number(selectedProductId));
    if (!prod) return;

    // Check if item already exists in cart, then update quantity
    const existingIdx = cartItems.findIndex((item) => item.productId === prod.id);
    if (existingIdx > -1) {
      const updated = [...cartItems];
      updated[existingIdx].quantity += Number(inputQuantity);
      setCartItems(updated);
    } else {
      setCartItems((prev) => [
        ...prev,
        {
          productId: prod.id,
          productName: prod.name,
          quantity: Number(inputQuantity),
          unitPrice: Number(inputUnitPrice),
        },
      ]);
    }

    // Reset inputs
    setSelectedProductId("");
    setInputQuantity("");
    setInputUnitPrice("");
  };

  const handleRemoveItem = (idx: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
  const grandTotal = Math.max(0, subtotal - Number(totalDiscount || 0));

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierId || !storeId || !sellerId || cartItems.length === 0) return;

    const selectedStore = stores.find((s) => s.id === Number(storeId));
    const selectedSupplier = suppliers.find((s) => s.id === Number(supplierId));
    const selectedSeller = sellers.find((s) => s.id === Number(sellerId));

    onSubmit({
      supplierId: Number(supplierId),
      supplierName: selectedSupplier?.name || "",
      storeId: Number(storeId),
      storeName: selectedStore?.name || "",
      sellerId: Number(sellerId),
      sellerName: selectedSeller?.name || "",
      total: subtotal,
      totalDiscount: Number(totalDiscount || 0),
      grandTotal: grandTotal,
      purchasesStatus: "PENDING", // Staged as pending
      items: cartItems.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
    });
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[650px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <ShoppingBagIcon className="size-5 text-primary" />
            Create Purchase Order
          </DialogTitle>
          <DialogDescription>
            Record supplier procurement purchases and stage them for corporate verification.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 pt-2">
          {/* Metadata Selections */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pur-store">Store Outlet *</Label>
              <Select value={storeId} onValueChange={setStoreId} disabled={loading}>
                <SelectTrigger id="pur-store">
                  <SelectValue placeholder="Select Store" />
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

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pur-supplier">Supplier *</Label>
              <Select value={supplierId} onValueChange={setSupplierId} disabled={loading}>
                <SelectTrigger id="pur-supplier">
                  <SelectValue placeholder="Select Supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pur-seller">Seller / Agent *</Label>
              <Select value={sellerId} onValueChange={setSellerId} disabled={loading}>
                <SelectTrigger id="pur-seller">
                  <SelectValue placeholder="Select Seller" />
                </SelectTrigger>
                <SelectContent>
                  {sellers.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Add Item Subsection */}
          <div className="rounded-lg border border-border/60 bg-muted/20 p-3 flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Staging Items Additions</h4>
            <div className="grid grid-cols-12 gap-3 items-end">
              <div className="col-span-5 flex flex-col gap-1">
                <Label className="text-[10px] uppercase font-semibold text-muted-foreground">Product</Label>
                <Select value={selectedProductId} onValueChange={handleProductSelect} disabled={loading}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Search product SKU" />
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

              <div className="col-span-3 flex flex-col gap-1">
                <Label className="text-[10px] uppercase font-semibold text-muted-foreground">Qty</Label>
                <Input
                  type="number"
                  placeholder="0"
                  className="h-9"
                  value={inputQuantity}
                  onChange={(e) => setInputQuantity(e.target.value === "" ? "" : Number(e.target.value))}
                  disabled={loading || !selectedProductId}
                />
              </div>

              <div className="col-span-3 flex flex-col gap-1">
                <Label className="text-[10px] uppercase font-semibold text-muted-foreground">Unit Cost ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="h-9"
                  value={inputUnitPrice}
                  onChange={(e) => setInputUnitPrice(e.target.value === "" ? "" : Number(e.target.value))}
                  disabled={loading || !selectedProductId}
                />
              </div>

              <div className="col-span-1">
                <Button
                  type="button"
                  size="icon"
                  className="size-9 bg-primary"
                  onClick={handleAddItem}
                  disabled={loading || !selectedProductId || !inputQuantity || inputQuantity <= 0}
                >
                  <PlusIcon className="size-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Cart Stage Items list Table */}
          <div className="rounded-lg border border-border/40 overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="text-xs">Product Name</TableHead>
                  <TableHead className="text-right text-xs w-[60px]">Qty</TableHead>
                  <TableHead className="text-right text-xs w-[90px]">Cost Price</TableHead>
                  <TableHead className="text-right text-xs w-[100px]">Subtotal</TableHead>
                  <TableHead className="w-[45px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cartItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-xs text-muted-foreground italic">
                      No items staged in purchase order yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  cartItems.map((item, idx) => (
                    <TableRow key={idx} className="hover:bg-muted/5">
                      <TableCell className="text-xs font-semibold">{item.productName}</TableCell>
                      <TableCell className="text-right text-xs font-mono">{item.quantity}</TableCell>
                      <TableCell className="text-right text-xs font-mono">${Number(item.unitPrice).toFixed(2)}</TableCell>
                      <TableCell className="text-right text-xs font-mono font-bold text-foreground">
                        ${(Number(item.quantity) * Number(item.unitPrice)).toFixed(2)}
                      </TableCell>
                      <TableCell className="p-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-7 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded"
                          onClick={() => handleRemoveItem(idx)}
                        >
                          <Trash2Icon className="size-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Totals & Discounts Summary block */}
          <div className="grid grid-cols-2 gap-4 items-end mt-2 pt-2 border-t border-border/40">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pur-disc">Order Discount Reduction ($)</Label>
              <Input
                id="pur-disc"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={totalDiscount || ""}
                onChange={(e) => setTotalDiscount(e.target.value === "" ? 0 : Number(e.target.value))}
                disabled={loading || cartItems.length === 0}
              />
            </div>

            <div className="flex flex-col gap-1 w-[200px] ml-auto text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal:</span>
                <span className="font-mono font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-rose-600">
                <span>Discount Amount:</span>
                <span className="font-mono">-${Number(totalDiscount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-foreground font-bold border-t border-border/40 pt-1.5 text-sm">
                <span>Grand Total:</span>
                <span className="font-mono text-primary">${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Dialog Action Footers */}
          <DialogFooter className="gap-2 pt-2 border-t border-border/40">
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
              disabled={loading || !supplierId || !storeId || !sellerId || cartItems.length === 0}
            >
              {loading && <Loader2Icon className="mr-2 size-4 animate-spin" />}
              Submit Order
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
