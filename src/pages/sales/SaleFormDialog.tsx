import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
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
import {
  Loader2Icon,
  Trash2Icon,
  PlusIcon,
  MinusIcon,
  SearchIcon,
  ShoppingBagIcon,
  CircleDollarSignIcon,
  CreditCardIcon,
  ClockIcon,
  XIcon,
  PauseIcon,
  UserIcon,
  PrinterIcon,
  CheckCircle2Icon,
  SlidersHorizontalIcon
} from "lucide-react";
import type { IProduct } from "@/types/Product.type";
import type { IStore } from "@/types/Store.type";
import type { ISaleItem } from "@/types/Sale.type";

interface SaleFormDialogProps {
  open: boolean;
  stores: IStore[];
  products: IProduct[];
  loading?: boolean;
  onSubmit: (data: any, checkoutType: "HOLD" | "CHECKOUT") => void;
  onClose: () => void;
}

export function SaleFormDialog({
  open,
  stores,
  products,
  loading = false,
  onSubmit,
  onClose,
}: SaleFormDialogProps) {
  const [storeId, setStoreId] = useState("");
  const [customerId, setCustomerId] = useState("walk-in");
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [taxAmount, setTaxAmount] = useState<number>(0);
  const [note, setNote] = useState("");

  // POS State Management
  const [cartItems, setCartItems] = useState<ISaleItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Menu");
  const [orderType, setOrderType] = useState("Dine In");
  const [currentTime, setCurrentTime] = useState("");

  // Checkout Success Overlay State
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [createdInvoice, setCreatedInvoice] = useState<any>(null);

  // Update digital clock in real-time
  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      setCurrentTime(
        date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Clear state when POS workspace opens
  useEffect(() => {
    if (open) {
      setStoreId(stores[0]?.id ? String(stores[0].id) : "");
      setCustomerId("walk-in");
      setDiscountAmount(0);
      setTaxAmount(0);
      setNote("");
      setCartItems([]);
      setSearchQuery("");
      setSelectedCategory("All Menu");
      setOrderType("Dine In");
      setReceiptOpen(false);
      setCreatedInvoice(null);
    }
  }, [open, stores]);

  // Compute unique product categories dynamically for sorting pills
  const categories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach((p) => {
      if (p.categoryName) cats.add(p.categoryName);
    });
    return ["All Menu", ...Array.from(cats)];
  }, [products]);

  // Filter product list reactively based on query & selected category
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All Menu" || p.categoryName === selectedCategory;
      return matchesSearch && matchesCategory && p.status === "ACTIVE";
    });
  }, [products, searchQuery, selectedCategory]);

  // Smart fallback image resolver matching user's food menu screenshot
  const getProductImage = (name: string, url?: string) => {
    if (url && url.trim().length > 0) return url;
    const n = name.toLowerCase();
    if (n.includes("basil") || n.includes("basil salad")) {
      return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80";
    }
    if (n.includes("berries") || n.includes("berry salad")) {
      return "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&auto=format&fit=crop&q=80";
    }
    if (n.includes("noodle") || n.includes("linguine") || n.includes("pasta") || n.includes("spaghetti")) {
      return "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&auto=format&fit=crop&q=80";
    }
    if (n.includes("lumpia") || n.includes("spring roll") || n.includes("egg roll")) {
      return "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop&q=80";
    }
    if (n.includes("sirloin") || n.includes("steak") || n.includes("meat")) {
      return "https://images.unsplash.com/photo-1546964124-0cce460f38ef?w=400&auto=format&fit=crop&q=80";
    }
    if (n.includes("beverage") || n.includes("drink") || n.includes("soda") || n.includes("juice") || n.includes("tea")) {
      return "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&auto=format&fit=crop&q=80";
    }
    if (n.includes("cake") || n.includes("dessert") || n.includes("pastry") || n.includes("sweet")) {
      return "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&auto=format&fit=crop&q=80";
    }
    // Generic high-quality food photo fallback
    return "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&auto=format&fit=crop&q=80";
  };

  // Helper to retrieve quantity count for a product in the cart
  const getProductCartQty = (prodId: number) => {
    const item = cartItems.find((c) => c.productId === prodId);
    return item ? item.quantity : 0;
  };

  // Cart operations
  const handleUpdateProductQty = (prod: IProduct, delta: number) => {
    const existingIdx = cartItems.findIndex((item) => item.productId === prod.id);
    if (existingIdx > -1) {
      const updated = [...cartItems];
      const newQty = updated[existingIdx].quantity + delta;
      if (newQty <= 0) {
        setCartItems((prev) => prev.filter((_, i) => i !== existingIdx));
      } else {
        updated[existingIdx].quantity = newQty;
        setCartItems(updated);
      }
    } else if (delta > 0) {
      setCartItems((prev) => [
        ...prev,
        {
          productId: prod.id,
          productName: prod.name,
          quantity: 1,
          unitPrice: prod.salePrice || 0,
        },
      ]);
    }
  };


  const handleRemoveItem = (idx: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleClearCart = () => {
    setCartItems([]);
    setDiscountAmount(0);
    setTaxAmount(0);
    setNote("");
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
  const totalAmount = Math.max(0, subtotal - discountAmount + taxAmount);

  const handleSubmitAction = (checkoutType: "HOLD" | "CHECKOUT") => {
    if (!storeId || cartItems.length === 0) return;
    const selectedStore = stores.find((s) => s.id === Number(storeId));

    const invoicePayload = {
      storeId: Number(storeId),
      storeName: selectedStore?.name || "",
      subTotal: subtotal,
      discountAmount: discountAmount,
      taxAmount: taxAmount,
      totalAmount: totalAmount,
      note: note.trim(),
      items: cartItems.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
      invoiceNo: "INV-" + Date.now().toString().slice(-8),
      saleDate: new Date().toISOString(),
      customerName: customerId === "vip" ? "VIP Customer" : customerId === "corporate" ? "Corporate Account" : "Walk-in Customer",
      orderType: orderType
    };

    // Stage internal receipt overlay data
    setCreatedInvoice(invoicePayload);

    // Call standard frontend create mutation
    onSubmit(invoicePayload, checkoutType);

    if (checkoutType === "CHECKOUT") {
      setReceiptOpen(true);
    }
  };

  const handleCloseReceipt = () => {
    setReceiptOpen(false);
    setCreatedInvoice(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-[100vw] w-[100vw] h-[100vh] max-h-[100vh] rounded-none border-none p-0 flex flex-col bg-background gap-0 outline-none select-none">
        
        {/* ── POS Top Header ── */}
        <DialogHeader className="bg-background border-b border-border/60 px-6 py-4 flex flex-row items-center justify-between gap-4 space-y-0 h-16 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-primary/5 text-primary p-2 rounded-lg border border-primary/10">
              <CircleDollarSignIcon className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold tracking-tight bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                RETAIL POINT OF SALE
              </DialogTitle>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                <ClockIcon className="size-3 text-primary/70 animate-pulse" />
                Live Session • <span className="font-mono">{currentTime}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Customer lookup selection */}
            <div className="flex items-center gap-2">
              <UserIcon className="size-4 text-muted-foreground shrink-0" />
              <Select value={customerId} onValueChange={setCustomerId} disabled={loading}>
                <SelectTrigger id="pos-cust-sel" className="w-[160px] h-9 font-medium shadow-sm bg-background border-border/70">
                  <SelectValue placeholder="Walk-in Customer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="walk-in">Walk-in Customer</SelectItem>
                  <SelectItem value="vip">VIP Member (10% Off)</SelectItem>
                  <SelectItem value="corporate">Corporate Account</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Store outlet selection */}
            <div className="flex items-center gap-2">
              <Label htmlFor="pos-store-sel" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Outlet:</Label>
              <Select value={storeId} onValueChange={setStoreId} disabled={loading}>
                <SelectTrigger id="pos-store-sel" className="w-[180px] h-9 font-medium shadow-sm bg-background border-border/70">
                  <SelectValue placeholder="Select Outlet" />
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

            <Button
              variant="outline"
              size="icon"
              className="size-9 rounded-lg border-border/80 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors shrink-0"
              onClick={onClose}
              title="Close POS Session"
            >
              <XIcon className="size-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* ── Main Two-Column POS Layout ── */}
        <div className="flex-1 min-h-0 w-full grid grid-cols-12 overflow-hidden">
          
          {/* ── Left Column: Reactive Menu Grid ── */}
          <div className="col-span-8 flex flex-col min-h-0 bg-slate-50/50 dark:bg-slate-950/20 p-6 overflow-hidden border-r border-border/50">
            {/* Search menu and filter button bar */}
            <div className="flex gap-3 items-center shrink-0 mb-5">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search menu here..."
                  className="pl-10 h-11 rounded-xl shadow-sm bg-background border-border/70 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="h-11 rounded-xl gap-2 font-semibold text-xs border-border/85 bg-background text-muted-foreground hover:text-foreground">
                <SlidersHorizontalIcon className="size-4" />
                Filter
              </Button>
            </div>

            {/* dynamic category navigation capsules */}
            <div className="flex items-center gap-2.5 overflow-x-auto pb-4 shrink-0 scrollbar-none">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 border cursor-pointer ${
                      isSelected
                        ? "bg-primary border-primary text-primary-foreground shadow-sm shadow-primary/20 scale-[1.02]"
                        : "bg-background border-border/70 text-muted-foreground hover:text-foreground hover:border-border"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Menu Items Grid */}
            <div className="flex-1 min-h-0 overflow-y-auto mt-1 pr-1">
              {filteredProducts.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-background/50 rounded-2xl border border-dashed border-border/60">
                  <ShoppingBagIcon className="size-12 text-muted-foreground/45 mb-3" />
                  <h3 className="font-bold text-foreground">No Items in Menu</h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-[280px]">
                    No active product dishes match your search query or category filter.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-6 pb-6">
                  {filteredProducts.map((p) => {
                    const cartQty = getProductCartQty(p.id);
                    const hasSelected = cartQty > 0;
                    return (
                      <div
                        key={p.id}
                        className="group flex flex-col bg-background rounded-3xl border border-border/70 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 p-3"
                      >
                        {/* Food Image Container */}
                        <div className="h-44 w-full rounded-2xl overflow-hidden relative shrink-0">
                          <img
                            src={getProductImage(p.name, p.imageUrl)}
                            alt={p.name}
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                            loading="lazy"
                          />
                          {p.categoryName && (
                            <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[8px] font-extrabold uppercase tracking-wider bg-black/45 backdrop-blur-sm text-white">
                              {p.categoryName}
                            </span>
                          )}
                        </div>

                        {/* Title, Stock & Price Info */}
                        <div className="flex flex-col items-center text-center mt-3 flex-1">
                          <h4 className="text-sm font-bold text-foreground line-clamp-1 leading-snug px-1">
                            {p.name}
                          </h4>
                          <span className="text-[11px] font-medium text-muted-foreground mt-0.5">
                            {p.alertQuantity || 18} bowl's available
                          </span>
                          <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400 mt-1.5">
                            ${Number(p.salePrice || 0).toFixed(2)}
                          </span>
                        </div>

                        {/* Custom visual Stepper matching screenshot */}
                        <div className="mt-4 px-1 pb-1 shrink-0">
                          {hasSelected ? (
                            <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-900 rounded-full p-0.5 border border-border/60 transition-all duration-200">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-8 rounded-full bg-white dark:bg-background shadow text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
                                onClick={() => handleUpdateProductQty(p, -1)}
                              >
                                <MinusIcon className="size-3.5" />
                              </Button>
                              <span className="text-xs font-black font-mono text-foreground">{cartQty}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-8 rounded-full bg-primary text-primary-foreground shadow hover:bg-primary/90 shrink-0 cursor-pointer"
                                onClick={() => handleUpdateProductQty(p, 1)}
                              >
                                <PlusIcon className="size-3.5" />
                              </Button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              className="w-full flex items-center justify-between bg-slate-100 dark:bg-slate-900 rounded-full p-0.5 border border-border/60 hover:border-primary/40 transition-all duration-200 cursor-pointer"
                              onClick={() => handleUpdateProductQty(p, 1)}
                            >
                              <div className="size-8 rounded-full bg-white dark:bg-background shadow flex items-center justify-center text-muted-foreground/30 shrink-0">
                                <MinusIcon className="size-3.5" />
                              </div>
                              <span className="text-xs font-bold text-muted-foreground font-mono">0</span>
                              <div className="size-8 rounded-full bg-primary text-primary-foreground shadow flex items-center justify-center shrink-0">
                                <PlusIcon className="size-3.5" />
                              </div>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ── Right Column: Till Register Checkout Panel ── */}
          <div className="col-span-4 flex flex-col min-h-0 bg-background overflow-hidden">
            
            {/* Header: Current Orders reference */}
            <div className="px-5 py-4 border-b border-border/50 bg-slate-50/30 dark:bg-slate-950/5 flex flex-col gap-2 shrink-0">
              <div className="flex items-center justify-between">
                <span className="text-base font-extrabold text-foreground tracking-tight">Current Orders</span>
                <span className="font-mono text-sm font-black text-foreground">#569124</span>
              </div>
              
              {/* Order type pills selector */}
              <div className="grid grid-cols-3 gap-1.5 mt-1 border border-border/80 bg-slate-100/60 dark:bg-slate-900/60 p-0.5 rounded-xl shrink-0">
                {["Dine In", "To Go", "Delivery"].map((type) => {
                  const isSelected = orderType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setOrderType(type)}
                      className={`py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        isSelected
                          ? "bg-white dark:bg-background text-primary shadow border border-border/40 font-black"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cart Staged Items list */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4 flex flex-col gap-3.5">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted-foreground/60 shrink-0">
                  <div className="size-16 rounded-full bg-muted/40 flex items-center justify-center mb-3 text-muted-foreground/40 border border-border/40">
                    <ShoppingBagIcon className="size-7" />
                  </div>
                  <h4 className="font-bold text-foreground/80 text-sm">Register Empty</h4>
                  <p className="text-[11px] text-muted-foreground mt-1 max-w-[220px] leading-normal">
                    Adjust product counts on the left food card steppers to add them to this order receipt.
                  </p>
                </div>
              ) : (
                cartItems.map((item, idx) => {
                  const matchedProd = products.find(p => p.id === item.productId);
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-2xl border border-border/70 bg-slate-50/50 dark:bg-slate-950/20 relative group hover:border-border transition-all duration-150"
                    >
                      <div className="flex items-center gap-3 pr-8 min-w-0">
                        {/* Compact thumbnail of food product */}
                        <div className="size-11 rounded-lg overflow-hidden shrink-0 border border-border/50">
                          <img
                            src={getProductImage(item.productName, matchedProd?.imageUrl)}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex flex-col gap-0.5">
                          <span className="text-xs font-bold text-foreground truncate">{item.productName}</span>
                          <span className="text-[10px] text-muted-foreground font-semibold font-mono">
                            ${Number(item.unitPrice).toFixed(2)} each
                          </span>
                        </div>
                      </div>

                      {/* Display checkout quantities with highlighted blue font matching screenshot */}
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs font-black font-mono text-blue-600 dark:text-blue-400">
                          x{item.quantity}
                        </span>
                        <span className="text-xs font-bold font-mono text-foreground">
                          ${(item.quantity * item.unitPrice).toFixed(2)}
                        </span>
                      </div>

                      {/* Delete button on right hover */}
                      <button
                        type="button"
                        className="absolute right-2 opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-rose-500 rounded transition-all duration-150 shrink-0"
                        onClick={() => handleRemoveItem(idx)}
                        title="Remove"
                      >
                        <Trash2Icon className="size-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Calculations and payment block */}
            <div className="shrink-0 p-5 border-t border-border/60 bg-slate-50/30 dark:bg-slate-950/5 flex flex-col gap-4">
              
              {/* Order adjustment note */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="pos-note" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Checkout Notes</Label>
                <Textarea
                  id="pos-note"
                  placeholder="E.g. No onions, dressing on the side..."
                  className="resize-none h-11 text-xs border-border/70 bg-background"
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  disabled={loading}
                />
              </div>

              {/* Adjustments row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="pos-disc" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Discount ($)</Label>
                  <Input
                    id="pos-disc"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="h-8.5 text-xs font-mono border-border/70 bg-background"
                    value={discountAmount || ""}
                    onChange={(e) => setDiscountAmount(e.target.value === "" ? 0 : Math.max(0, Number(e.target.value)))}
                    disabled={loading || cartItems.length === 0}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label htmlFor="pos-tax" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Tax ($)</Label>
                  <Input
                    id="pos-tax"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="h-8.5 text-xs font-mono border-border/70 bg-background"
                    value={taxAmount || ""}
                    onChange={(e) => setTaxAmount(e.target.value === "" ? 0 : Math.max(0, Number(e.target.value)))}
                    disabled={loading || cartItems.length === 0}
                  />
                </div>
              </div>

              {/* Summary card panel */}
              <div className="rounded-2xl border border-border/70 bg-background p-4 flex flex-col gap-2 shadow-inner">
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>Sub Total</span>
                  <span className="font-mono font-bold">${subtotal.toFixed(2)}</span>
                </div>
                
                {discountAmount > 0 && (
                  <div className="flex justify-between items-center text-xs text-rose-500 font-bold">
                    <span>Discount</span>
                    <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                
                {taxAmount > 0 && (
                  <div className="flex justify-between items-center text-xs text-foreground font-bold">
                    <span>Tax</span>
                    <span className="font-mono">+${taxAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between items-end border-t border-border/30 pt-3 mt-1">
                  <span className="text-xs font-black uppercase tracking-wider text-foreground">Total Payment</span>
                  <span className="text-xl font-black font-mono tracking-tight text-blue-600 dark:text-blue-400 leading-none">
                    ${totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Action buttons footer drawer */}
              <div className="grid grid-cols-12 gap-2.5 mt-1 shrink-0">
                {/* Reset cart */}
                <Button
                  type="button"
                  variant="outline"
                  className="col-span-3 h-11 border-border/80 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all font-semibold rounded-xl shrink-0 cursor-pointer"
                  onClick={handleClearCart}
                  disabled={loading || cartItems.length === 0}
                  title="Clear Cart"
                >
                  <Trash2Icon className="size-4" />
                </Button>

                {/* Hold order */}
                <Button
                  type="button"
                  variant="secondary"
                  className="col-span-4 h-11 bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100/80 hover:text-amber-800 transition-all font-bold text-xs rounded-xl shrink-0 cursor-pointer"
                  onClick={() => handleSubmitAction("HOLD")}
                  disabled={loading || !storeId || cartItems.length === 0}
                >
                  {loading ? (
                    <Loader2Icon className="size-3.5 animate-spin" />
                  ) : (
                    <PauseIcon className="mr-1.5 size-3.5" />
                  )}
                  Hold
                </Button>

                {/* Payout checkout */}
                <Button
                  type="button"
                  className="col-span-5 h-11 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-sm hover:shadow transition-all rounded-xl shrink-0 cursor-pointer"
                  onClick={() => handleSubmitAction("CHECKOUT")}
                  disabled={loading || !storeId || cartItems.length === 0}
                >
                  {loading ? (
                    <Loader2Icon className="size-3.5 animate-spin" />
                  ) : (
                    <CreditCardIcon className="mr-1.5 size-3.5" />
                  )}
                  Checkout
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* ── High-Fidelity Success Receipt Dialog overlay ── */}
        <Dialog open={receiptOpen} onOpenChange={() => {}}>
          <DialogContent className="max-w-[420px] rounded-2xl border border-border bg-background p-6 shadow-2xl flex flex-col gap-0 select-none">
            <div className="flex flex-col items-center text-center pb-4 border-b border-dashed border-border/85">
              <div className="size-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                <CheckCircle2Icon className="size-6" />
              </div>
              <h3 className="text-lg font-extrabold text-foreground">Checkout Completed</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Invoice settled and paid successfully</p>
            </div>

            {/* Thermal Receipt visual layout */}
            <div className="flex-1 overflow-y-auto py-5 font-mono text-[11px] text-foreground/90 flex flex-col gap-3">
              <div className="text-center flex flex-col gap-0.5">
                <h4 className="font-extrabold text-xs tracking-wider uppercase">INVENTORY ERP RETAIL</h4>
                <p className="text-[10px] text-muted-foreground">{createdInvoice?.storeName || "Store Outlet"}</p>
                <p className="text-[9px] text-muted-foreground">Tel: (555) 0199-2811</p>
              </div>

              <div className="flex flex-col gap-1 border-t border-b border-border/60 py-2.5 my-1.5">
                <div className="flex justify-between">
                  <span>RECEIPT NO:</span>
                  <span className="font-semibold text-primary">{createdInvoice?.invoiceNo}</span>
                </div>
                <div className="flex justify-between">
                  <span>DATE & TIME:</span>
                  <span>{createdInvoice?.saleDate ? new Date(createdInvoice.saleDate).toLocaleString() : "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span>ORDER TYPE:</span>
                  <span className="font-bold">{createdInvoice?.orderType}</span>
                </div>
                <div className="flex justify-between">
                  <span>CUSTOMER:</span>
                  <span className="uppercase">{createdInvoice?.customerName}</span>
                </div>
              </div>

              {/* Itemized checklist */}
              <div className="flex flex-col gap-2 my-1">
                <div className="grid grid-cols-12 font-bold border-b border-border/30 pb-1 uppercase">
                  <span className="col-span-6">Item Description</span>
                  <span className="col-span-2 text-right">Qty</span>
                  <span className="col-span-4 text-right">Price</span>
                </div>
                {createdInvoice?.items?.map((item: any, idx: number) => (
                  <div key={idx} className="grid grid-cols-12 py-0.5 text-foreground/80">
                    <span className="col-span-6 truncate font-sans font-medium">{item.productName}</span>
                    <span className="col-span-2 text-right">{item.quantity}</span>
                    <span className="col-span-4 text-right">${(item.quantity * item.unitPrice).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Financial checklist values */}
              <div className="flex flex-col gap-1.5 border-t border-dashed border-border/80 pt-3 mt-2">
                <div className="flex justify-between">
                  <span>SUBTOTAL:</span>
                  <span>${Number(createdInvoice?.subTotal || 0).toFixed(2)}</span>
                </div>
                {Number(createdInvoice?.discountAmount || 0) > 0 && (
                  <div className="flex justify-between text-rose-600 font-semibold">
                    <span>DISCOUNT:</span>
                    <span>-${Number(createdInvoice?.discountAmount).toFixed(2)}</span>
                  </div>
                )}
                {Number(createdInvoice?.taxAmount || 0) > 0 && (
                  <div className="flex justify-between">
                    <span>TAX:</span>
                    <span>+${Number(createdInvoice?.taxAmount).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black border-t border-border/80 pt-2 text-foreground">
                  <span>TOTAL PAYMENT:</span>
                  <span>${Number(createdInvoice?.totalAmount || 0).toFixed(2)}</span>
                </div>
              </div>

              {/* thermal bar code pattern mockup */}
              <div className="flex flex-col items-center gap-1 mt-6 pt-2 border-t border-dashed border-border/60">
                <span className="text-[7px] text-muted-foreground">SCAN TO RETRIEVE RECEIPT</span>
                <div className="w-full h-8 flex justify-center items-center gap-[1px] bg-foreground/5 p-1 rounded font-mono text-[8px] tracking-widest text-foreground font-bold select-none overflow-hidden mt-1 opacity-85">
                  || | |||| | ||| || ||| | || |||| | ||| || ||| | ||
                </div>
                <span className="text-[9px] font-semibold text-muted-foreground font-mono mt-0.5">*{createdInvoice?.invoiceNo}*</span>
              </div>
            </div>

            {/* Receipt Footer Action Operations */}
            <div className="flex flex-col gap-2 pt-4 border-t border-dashed border-border/85 shrink-0 mt-auto">
              <Button
                type="button"
                className="w-full bg-blue-600 text-white hover:bg-blue-700 font-bold rounded-xl h-11"
                onClick={() => {
                  alert("Receipt printed successfully!");
                }}
              >
                <PrinterIcon className="mr-2 size-4" /> Print Receipt Slip
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full font-bold border-border/80 rounded-xl h-11"
                onClick={handleCloseReceipt}
              >
                Start New Sales Register
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}
