import type { IPurchase } from "@/types/Purchase.type";
import type { ColumnDef } from "@tanstack/react-table";
import { StatusBadge } from "@/utils/Statusbadge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVerticalIcon, EyeIcon, Trash2Icon, CheckCircle2Icon, XCircleIcon, ThumbsUpIcon } from "lucide-react";


export interface PurchaseColumnActions {
  onViewDetails: (purchase: IPurchase) => void;
  onApprove: (purchase: IPurchase) => void;
  onComplete: (purchase: IPurchase) => void;
  onCancel: (purchase: IPurchase) => void;
  onDelete: (purchase: IPurchase) => void;
}

export function getColumns({
  onViewDetails,
  onApprove,
  onComplete,
  onCancel,
  onDelete,
}: PurchaseColumnActions): ColumnDef<IPurchase>[] {
  return [
    {
      accessorKey: "reference",
      header: "Reference No",
      cell: ({ row }) => (
        <span className="font-mono text-xs font-semibold text-primary">
          {row.original.reference}
        </span>
      ),
    },
    {
      accessorKey: "supplierName",
      header: "Supplier Name",
      cell: ({ row }) => (
        <span className="font-semibold">{row.original.supplierName || "—"}</span>
      ),
    },
    {
      accessorKey: "storeName",
      header: "Store Outlet",
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.storeName || "—"}</span>
      ),
    },
    {
      accessorKey: "grandTotal",
      header: "Grand Total",
      cell: ({ row }) => {
        const val = row.original.grandTotal;
        return (
          <span className="font-bold text-foreground">
            ${val !== undefined && val !== null ? Number(val).toFixed(2) : "0.00"}
          </span>
        );
      },
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        const dateStr = row.original.date;
        if (!dateStr) return "—";
        try {
          const date = new Date(dateStr);
          return <span>{date.toLocaleDateString("en-US", { dateStyle: "medium" })}</span>;
        } catch {
          return <span>{dateStr}</span>;
        }
      },
    },
    {
      accessorKey: "purchasesStatus",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.purchasesStatus || "PENDING";
        return <StatusBadge status={status} />;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const item = row.original;
        const status = (item.purchasesStatus || "PENDING").toUpperCase();
        const isPending = status === "PENDING";
        const isApproved = status === "APPROVED";

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-muted-foreground data-[state=open]:bg-muted"
              >
                <EllipsisVerticalIcon className="size-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={() => onViewDetails(item)}>
                <EyeIcon className="mr-2 size-4 text-primary" />
                View Details
              </DropdownMenuItem>

              {isPending && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onApprove(item)}>
                    <ThumbsUpIcon className="mr-2 size-4 text-emerald-600" />
                    Approve Order
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onCancel(item)} className="text-rose-600">
                    <XCircleIcon className="mr-2 size-4" />
                    Cancel Order
                  </DropdownMenuItem>
                </>
              )}

              {isApproved && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onComplete(item)}>
                    <CheckCircle2Icon className="mr-2 size-4 text-primary" />
                    Mark Completed
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onCancel(item)} className="text-rose-600">
                    <XCircleIcon className="mr-2 size-4" />
                    Cancel Order
                  </DropdownMenuItem>
                </>
              )}

              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => onDelete(item)}
              >
                <Trash2Icon className="mr-2 size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
