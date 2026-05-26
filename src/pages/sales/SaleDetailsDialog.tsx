import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/utils/Statusbadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Loader2Icon,
  CheckCircle2Icon,
  XCircleIcon,
  FileSpreadsheetIcon,
  CalendarIcon,
  StoreIcon,
  FileTextIcon,
  CornerUpLeftIcon
} from "lucide-react";
import type { ISale } from "@/types/Sale.type";
import { hasPermission } from "@/utils/auth";

interface SaleDetailsDialogProps {
  open: boolean;
  sale: ISale | null;
  actionLoading?: boolean;
  onComplete: (id: number) => void;
  onCancel: (id: number) => void;
  onReturn: (id: number) => void;
  onClose: () => void;
}

export function SaleDetailsDialog({
  open,
  sale,
  actionLoading = false,
  onComplete,
  onCancel,
  onReturn,
  onClose,
}: SaleDetailsDialogProps) {
  if (!sale) return null;

  const status = (sale.status || "PENDING").toUpperCase();
  const isPending = status === "PENDING";
  const isCompleted = status === "COMPLETED";

  const items = sale.items || [];

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[650px] overflow-hidden rounded-xl border border-border/80 bg-background/95 backdrop-blur-md shadow-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <DialogTitle className="text-xl font-bold tracking-tight flex items-center gap-2">
                <FileSpreadsheetIcon className="size-5 text-primary" />
                Sales Invoice Details
              </DialogTitle>
              <DialogDescription className="mt-1">
                Invoice No: <span className="font-mono text-xs font-semibold text-primary">{sale.invoiceNo}</span>
              </DialogDescription>
            </div>
            <StatusBadge status={sale.status || "PENDING"} />
          </div>
        </DialogHeader>

        <div className="grid gap-4 py-2 overflow-y-auto max-h-[60vh] pr-1">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 rounded-lg border border-border/50 bg-muted/30 p-4 text-sm">
            <div className="flex items-start gap-2">
              <StoreIcon className="size-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-xs font-medium text-muted-foreground">Store Outlet</p>
                <p className="font-semibold text-foreground">{sale.storeName || "—"}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <CalendarIcon className="size-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-xs font-medium text-muted-foreground">Sale Date</p>
                <p className="font-semibold text-foreground">
                  {sale.saleDate
                    ? new Date(sale.saleDate).toLocaleDateString("en-US", { dateStyle: "long" })
                    : "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="rounded-lg border border-border/40 overflow-hidden">
            <div className="bg-muted/40 px-3 py-2 border-b border-border/40">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Sales Items</h4>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/10 hover:bg-muted/10">
                  <TableHead className="text-xs font-semibold">Product Name</TableHead>
                  <TableHead className="text-right text-xs font-semibold w-[80px]">Qty</TableHead>
                  <TableHead className="text-right text-xs font-semibold w-[100px]">Unit Price</TableHead>
                  <TableHead className="text-right text-xs font-semibold w-[120px]">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-xs text-muted-foreground italic">
                      No items registered in this sales order.
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item, idx) => (
                    <TableRow key={idx} className="hover:bg-muted/5">
                      <TableCell className="text-xs font-medium text-foreground">{item.productName}</TableCell>
                      <TableCell className="text-right text-xs font-mono">{item.quantity}</TableCell>
                      <TableCell className="text-right text-xs font-mono">${Number(item.unitPrice).toFixed(2)}</TableCell>
                      <TableCell className="text-right text-xs font-mono font-semibold text-foreground">
                        ${(Number(item.quantity) * Number(item.unitPrice)).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Notes */}
          {sale.note && (
            <div className="rounded-lg border border-border/40 p-3 bg-muted/10">
              <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <FileTextIcon className="size-3.5" /> Remarks / Notes
              </h5>
              <p className="text-xs text-foreground bg-muted/20 p-2 rounded italic">
                "{sale.note}"
              </p>
            </div>
          )}

          {/* Financial Summary */}
          <div className="flex flex-col gap-1.5 w-[250px] ml-auto border border-border/40 rounded-lg p-3 bg-muted/20 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal:</span>
              <span className="font-mono">${Number(sale.subTotal || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-rose-600">
              <span>Discount amount:</span>
              <span className="font-mono">-${Number(sale.discountAmount || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-foreground">
              <span>Tax amount:</span>
              <span className="font-mono">${Number(sale.taxAmount || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-foreground font-bold border-t border-border/40 pt-1.5 text-sm">
              <span>Total Amount:</span>
              <span className="font-mono text-primary">${Number(sale.totalAmount || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 pt-2 border-t border-border/40">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={actionLoading}
          >
            Close
          </Button>

          {isPending && (
            <>
              {hasPermission("SALE_CANCEL") && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => onCancel(sale.id)}
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <Loader2Icon className="mr-2 size-4 animate-spin" />
                  ) : (
                    <XCircleIcon className="mr-2 size-4" />
                  )}
                  Cancel
                </Button>
              )}
              {hasPermission("SALE_COMPLETE") && (
                <Button
                  type="button"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                  onClick={() => onComplete(sale.id)}
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <Loader2Icon className="mr-2 size-4 animate-spin" />
                  ) : (
                    <CheckCircle2Icon className="mr-2 size-4" />
                  )}
                  Mark Completed
                </Button>
              )}
            </>
          )}

          {isCompleted && hasPermission("SALE_RETURN") && (
            <Button
              type="button"
              className="bg-amber-600 hover:bg-amber-700 text-white font-medium"
              onClick={() => onReturn(sale.id)}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <Loader2Icon className="mr-2 size-4 animate-spin" />
              ) : (
                <CornerUpLeftIcon className="mr-2 size-4" />
              )}
              Return Sale
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
