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
  ArrowLeftRightIcon,
  CalendarIcon,
  UserIcon,
  StoreIcon,  
  FileTextIcon,
  ThumbsUpIcon
} from "lucide-react";
import type { ITransfer } from "@/types/Transfer.type";

interface TransferDetailsDialogProps {
  open: boolean;
  transfer: ITransfer | null;
  actionLoading?: boolean;
  onApprove: (id: number) => void;
  onComplete: (id: number) => void;
  onCancel: (id: number) => void;
  onClose: () => void;
}

export function TransferDetailsDialog({
  open,
  transfer,
  actionLoading = false,
  onApprove,
  onComplete,
  onCancel,
  onClose,
}: TransferDetailsDialogProps) {
  if (!transfer) return null;

  const status = (transfer.status || "PENDING").toUpperCase();
  const isPending = status === "PENDING";
  const isApproved = status === "APPROVED";
  const canCancel = isPending || isApproved;

  const items = transfer.items || [];

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[650px] overflow-hidden rounded-xl border border-border/80 bg-background/95 backdrop-blur-md shadow-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <DialogTitle className="text-xl font-bold tracking-tight flex items-center gap-2">
                <ArrowLeftRightIcon className="size-5 text-primary" />
                Inventory Transfer Details
              </DialogTitle>
              <DialogDescription className="mt-1">
                Transfer No: <span className="font-mono text-xs font-semibold text-primary">{transfer.transferNo}</span>
              </DialogDescription>
            </div>
            <StatusBadge status={transfer.status || "PENDING"} />
          </div>
        </DialogHeader>

        <div className="grid gap-4 py-2 overflow-y-auto max-h-[60vh] pr-1">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 rounded-lg border border-border/50 bg-muted/30 p-4 text-sm">
            <div className="flex items-start gap-2">
              <StoreIcon className="size-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-xs font-medium text-muted-foreground">From Store Outlet</p>
                <p className="font-semibold text-foreground">Store #{transfer.fromStoreId}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <StoreIcon className="size-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-xs font-medium text-muted-foreground">To Store Outlet</p>
                <p className="font-semibold text-foreground">Store #{transfer.toStoreId}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <UserIcon className="size-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-xs font-medium text-muted-foreground">Created By</p>
                <p className="font-semibold text-foreground">{transfer.createdBy || "—"}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <CalendarIcon className="size-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-xs font-medium text-muted-foreground">Transfer Date</p>
                <p className="font-semibold text-foreground">
                  {transfer.date
                    ? new Date(transfer.date).toLocaleDateString("en-US", { dateStyle: "long" })
                    : "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="rounded-lg border border-border/40 overflow-hidden">
            <div className="bg-muted/40 px-3 py-2 border-b border-border/40">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Transfer Items</h4>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/10 hover:bg-muted/10">
                  <TableHead className="text-xs font-semibold">Product Name</TableHead>
                  <TableHead className="text-right text-xs font-semibold w-[80px]">Qty</TableHead>
                  <TableHead className="text-right text-xs font-semibold w-[100px]">Unit Value</TableHead>
                  <TableHead className="text-right text-xs font-semibold w-[120px]">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-xs text-muted-foreground italic">
                      No products registered in this transfer order.
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
          {transfer.note && (
            <div className="rounded-lg border border-border/40 p-3 bg-muted/10">
              <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <FileTextIcon className="size-3.5" /> Transfer Notes / Remarks
              </h5>
              <p className="text-xs text-foreground bg-muted/20 p-2 rounded italic">
                "{transfer.note}"
              </p>
            </div>
          )}

          {/* Summary */}
          <div className="flex flex-col gap-1 w-[250px] ml-auto border border-border/40 rounded-lg p-3 bg-muted/20 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal:</span>
              <span className="font-mono">${Number(transfer.total || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-foreground font-bold border-t border-border/40 pt-1.5 text-sm">
              <span>Grand Total:</span>
              <span className="font-mono text-primary">${Number(transfer.grandTotal || 0).toFixed(2)}</span>
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

          {canCancel && (
            <Button
              type="button"
              variant="destructive"
              onClick={() => onCancel(transfer.id)}
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

          {isPending && (
            <Button
              type="button"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
              onClick={() => onApprove(transfer.id)}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <Loader2Icon className="mr-2 size-4 animate-spin" />
              ) : (
                <ThumbsUpIcon className="mr-2 size-4" />
              )}
              Approve
            </Button>
          )}

          {isApproved && (
            <Button
              type="button"
              className="bg-primary hover:bg-primary/95 text-white font-medium"
              onClick={() => onComplete(transfer.id)}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <Loader2Icon className="mr-2 size-4 animate-spin" />
              ) : (
                <CheckCircle2Icon className="mr-2 size-4" />
              )}
              Receive / Complete
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
