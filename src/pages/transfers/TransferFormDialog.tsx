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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2Icon, Trash2Icon, PlusIcon, ArrowLeftRightIcon } from "lucide-react";
import type { IProduct } from "@/types/Product.type";
import type { IStore } from "@/types/Store.type";
import type { ITransferItem } from "@/types/Transfer.type";

interface TransferFormDialogProps {
  open: boolean;
  stores: IStore[];
  products: IProduct[];
  loading?: boolean;
  onSubmit: (data: any) => void;
  onClose: () => void;
}

export function TransferFormDialog({
  open,
  stores,
  products,
  loading = false,
  onSubmit,
  onClose,
}: TransferFormDialogProps) {
  const [fromStoreId, setFromStoreId] = useState("");
  const [toStoreId, setToStoreId] = useState("");
  const [note, setNote] = useState("");

  // Dynamic cart states
  const [cartItems, setCartItems] = useState<ITransferItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [inputQuantity, setInputQuantity] = useState<number | "">("");

  // Clear/reset state on open
  useEffect(() => {
    if (open) {
      setFromStoreId("");
      setToStoreId("");
      setNote("");
      setCartItems([]);
      setSelectedProductId("");
      setInputQuantity("");
    }
  }, [open]);

  const handleAddItem = () => {
    if (!selectedProductId || !inputQuantity || inputQuantity <= 0) return;

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
          unitPrice: prod.costPrice || 0, // Uses cost price as base unit value
        },
      ]);
    }

    // Reset inputs
    setSelectedProductId("");
    setInputQuantity("");
  };

  const handleRemoveItem = (idx: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromStoreId || !toStoreId || fromStoreId === toStoreId || cartItems.length === 0) return;

    onSubmit({
      fromStoreId: Number(fromStoreId),
      toStoreId: Number(toStoreId),
      note: note.trim(),
      total: subtotal,
      grandTotal: subtotal,
      status: "PENDING", // Staged as pending
      items: cartItems.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
    });
  };

  // Prevent transferring to the same store
  const targetStores = stores.filter((s) => s.id !== Number(fromStoreId));

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[650px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <ArrowLeftRightIcon className="size-5 text-primary" />
            Create Stock Transfer Order
          </DialogTitle>
          <DialogDescription>
            Initiate an inter-outlet stock transfer to replenish target retail store outlets.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 pt-2">
          {/* Store Selections Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="tran-from">From Store Outlet *</Label>
              <Select value={fromStoreId} onValueChange={setFromStoreId} disabled={loading}>
                <SelectTrigger id="tran-from">
                  <SelectValue placeholder="Select Origin Store" />
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
              <Label htmlFor="tran-to">To Store Outlet *</Label>
              <Select value={toStoreId} onValueChange={setToStoreId} disabled={loading || !fromStoreId}>
                <SelectTrigger id="tran-to">
                  <SelectValue placeholder="Select Destination Store" />
                </SelectTrigger>
                <SelectContent>
                  {targetStores.map((s) => (
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
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Add Products to Transfer</h4>
            <div className="grid grid-cols-12 gap-3 items-end">
              <div className="col-span-8 flex flex-col gap-1">
                <Label className="text-[10px] uppercase font-semibold text-muted-foreground">Product</Label>
                <Select value={selectedProductId} onValueChange={setSelectedProductId} disabled={loading}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Search SKU product catalog..." />
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

          {/* Transfer Cart Table */}
          <div className="rounded-lg border border-border/40 overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="text-xs">Product Name</TableHead>
                  <TableHead className="text-right text-xs w-[80px]">Quantity</TableHead>
                  <TableHead className="text-right text-xs w-[110px]">Cost Price</TableHead>
                  <TableHead className="text-right text-xs w-[120px]">Subtotal</TableHead>
                  <TableHead className="w-[45px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cartItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-xs text-muted-foreground italic">
                      No products staged in transfer order yet.
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

          {/* Note Field & Summary */}
          <div className="grid grid-cols-2 gap-4 items-end mt-2 pt-2 border-t border-border/40">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="tran-note">Transfer Remarks / Notes</Label>
              <Textarea
                id="tran-note"
                placeholder="Reason for transfer, transport details..."
                className="resize-none"
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="flex flex-col gap-1 w-[200px] ml-auto text-xs">
              <div className="flex justify-between text-foreground font-bold border-t border-border/40 pt-1.5 text-sm">
                <span>Grand Total:</span>
                <span className="font-mono text-primary">${subtotal.toFixed(2)}</span>
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
              disabled={loading || !fromStoreId || !toStoreId || cartItems.length === 0}
            >
              {loading && <Loader2Icon className="mr-2 size-4 animate-spin" />}
              Submit Transfer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
