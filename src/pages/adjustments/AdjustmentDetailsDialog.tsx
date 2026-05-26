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
import { Badge } from "@/components/ui/badge";
import { Loader2Icon, CheckCircle2Icon, XCircleIcon, CalendarIcon, UserIcon, StoreIcon, FileTextIcon } from "lucide-react";
import type { IAdjustment } from "@/types/Adjustment.type";

interface AdjustmentDetailsDialogProps {
  open: boolean;
  adjustment: IAdjustment | null;
  loading?: boolean;
  onUpdateStatus: (id: number, status: string) => void;
  onClose: () => void;
}

export function AdjustmentDetailsDialog({
  open,
  adjustment,
  loading = false,
  onUpdateStatus,
  onClose,
}: AdjustmentDetailsDialogProps) {
  if (!adjustment) return null;

  const isPending = adjustment.status?.toUpperCase() === "PENDING";
  const type = adjustment.adjustmentType || "INCREASE";
  const isAddition = type.toUpperCase() === "INCREASE" || type.toUpperCase() === "IN" || type.toUpperCase() === "ADDITION";

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[500px] overflow-hidden rounded-xl border border-border/80 bg-background/95 backdrop-blur-md shadow-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <DialogTitle className="text-xl font-bold tracking-tight flex items-center gap-2">
                <FileTextIcon className="size-5 text-primary" />
                Adjustment Details
              </DialogTitle>
              <DialogDescription className="mt-1">
                Reference No: <span className="font-mono text-xs font-semibold text-primary">{adjustment.referenceNo}</span>
              </DialogDescription>
            </div>
            <StatusBadge status={adjustment.status || "PENDING"} />
          </div>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Main Info Card */}
          <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
            <div className="flex items-center justify-between mb-4 border-b border-border/40 pb-3">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Product</p>
                <h4 className="text-base font-bold text-foreground mt-0.5">{adjustment.productName}</h4>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider text-right">Adjustment Quantity</p>
                <div className="flex justify-end mt-1">
                  {isAddition ? (
                    <Badge className="bg-emerald-500/10 hover:bg-emerald-500/10 border-emerald-500/30 text-emerald-600 font-bold text-sm">
                      +{adjustment.quantity} (Stock In)
                    </Badge>
                  ) : (
                    <Badge className="bg-red-500/10 hover:bg-red-500/10 border-red-500/30 text-red-600 font-bold text-sm">
                      -{adjustment.quantity} (Stock Out)
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
              <div className="flex items-start gap-2">
                <StoreIcon className="size-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Store Outlet</p>
                  <p className="font-semibold text-foreground">{adjustment.storeName || "—"}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <UserIcon className="size-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Created By</p>
                  <p className="font-semibold text-foreground">{adjustment.createdBy || "—"}</p>
                </div>
              </div>

              <div className="flex items-start gap-2 col-span-2">
                <CalendarIcon className="size-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Adjustment Date</p>
                  <p className="font-semibold text-foreground">
                    {adjustment.adjustmentDate
                      ? new Date(adjustment.adjustmentDate).toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" })
                      : "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Reason Section */}
          <div className="rounded-lg border border-border/40 p-4">
            <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Reason for Adjustment</h5>
            <p className="text-sm text-foreground/90 bg-muted/20 p-2.5 rounded border border-border/20 italic">
              "{adjustment.reason || "No reason specified."}"
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 pt-2 border-t border-border/40">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Close
          </Button>

          {isPending && (
            <div className="flex gap-2">
              <Button
                type="button"
                variant="destructive"
                onClick={() => onUpdateStatus(adjustment.id, "CANCELLED")}
                disabled={loading}
              >
                {loading ? (
                  <Loader2Icon className="mr-2 size-4 animate-spin" />
                ) : (
                  <XCircleIcon className="mr-2 size-4" />
                )}
                Reject / Cancel
              </Button>
              <Button
                type="button"
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => onUpdateStatus(adjustment.id, "COMPLETED")}
                disabled={loading}
              >
                {loading ? (
                  <Loader2Icon className="mr-2 size-4 animate-spin" />
                ) : (
                  <CheckCircle2Icon className="mr-2 size-4" />
                )}
                Approve / Complete
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
