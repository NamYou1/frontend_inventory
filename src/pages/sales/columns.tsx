import type { ISale } from "@/types/Sale.type";
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
import { EllipsisVerticalIcon, EyeIcon, Trash2Icon, CheckCircle2Icon, XCircleIcon, CornerUpLeftIcon } from "lucide-react";
import { hasPermission } from "@/utils/auth";


export interface SaleColumnActions {
  onViewDetails: (sale: ISale) => void;
  onComplete: (sale: ISale) => void;
  onCancel: (sale: ISale) => void;
  onReturn: (sale: ISale) => void;
  onDelete: (sale: ISale) => void;
}

export function getColumns({
  onViewDetails,
  onComplete,
  onCancel,
  onReturn,
  onDelete,
}: SaleColumnActions): ColumnDef<ISale>[] {
  return [
    {
      accessorKey: "invoiceNo",
      header: "Invoice No",
      cell: ({ row }) => (
        <span className="font-mono text-xs font-semibold text-primary">
          {row.original.invoiceNo}
        </span>
      ),
    },
    {
      accessorKey: "storeName",
      header: "Store Outlet",
      cell: ({ row }) => (
        <span className="font-semibold">{row.original.storeName || "—"}</span>
      ),
    },
    {
      accessorKey: "totalAmount",
      header: "Total Amount",
      cell: ({ row }) => {
        const val = row.original.totalAmount;
        return (
          <span className="font-bold text-foreground">
            ${val !== undefined && val !== null ? Number(val).toFixed(2) : "0.00"}
          </span>
        );
      },
    },
    {
      accessorKey: "saleDate",
      header: "Sale Date",
      cell: ({ row }) => {
        const dateStr = row.original.saleDate;
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
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status || "PENDING";
        return <StatusBadge status={status} />;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const item = row.original;
        const status = (item.status || "PENDING").toUpperCase();
        const isPending = status === "PENDING";
        const isCompleted = status === "COMPLETED";

        const canComplete = hasPermission("SALE_COMPLETE");
        const canCancel = hasPermission("SALE_CANCEL");
        const canReturn = hasPermission("SALE_RETURN");
        const canDelete = hasPermission("SALE_DELETE");

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

              {isPending && (canComplete || canCancel) && (
                <>
                  <DropdownMenuSeparator />
                  {canComplete && (
                    <DropdownMenuItem onClick={() => onComplete(item)}>
                      <CheckCircle2Icon className="mr-2 size-4 text-emerald-600" />
                      Complete Sale
                    </DropdownMenuItem>
                  )}
                  {canCancel && (
                    <DropdownMenuItem onClick={() => onCancel(item)} className="text-rose-600">
                      <XCircleIcon className="mr-2 size-4" />
                      Cancel Sale
                    </DropdownMenuItem>
                  )}
                </>
              )}

              {isCompleted && canReturn && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onReturn(item)}>
                    <CornerUpLeftIcon className="mr-2 size-4 text-amber-600" />
                    Return Sale
                  </DropdownMenuItem>
                </>
              )}

              {canDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => onDelete(item)}
                  >
                    <Trash2Icon className="mr-2 size-4" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
