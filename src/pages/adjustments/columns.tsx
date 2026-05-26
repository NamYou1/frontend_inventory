import type { IAdjustment } from "@/types/Adjustment.type";
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
import { EllipsisVerticalIcon, EyeIcon, Trash2Icon, CheckCircle2Icon, XCircleIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface AdjustmentColumnActions {
  onViewDetails: (adjustment: IAdjustment) => void;
  onComplete: (adjustment: IAdjustment) => void;
  onCancel: (adjustment: IAdjustment) => void;
  onDelete: (adjustment: IAdjustment) => void;
}

export function getColumns({
  onViewDetails,
  onComplete,
  onCancel,
  onDelete,
}: AdjustmentColumnActions): ColumnDef<IAdjustment>[] {
  return [
    {
      accessorKey: "referenceNo",
      header: "Reference No",
      cell: ({ row }) => (
        <span className="font-mono text-xs font-semibold text-primary">
          {row.original.referenceNo}
        </span>
      ),
    },
    {
      accessorKey: "productName",
      header: "Product Name",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.productName}</span>
      ),
    },
    {
      accessorKey: "storeName",
      header: "Store Name",
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.storeName}</span>
      ),
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      cell: ({ row }) => {
        const qty = row.original.quantity;
        const type = row.original.adjustmentType || "INCREASE";
        const isAddition = type.toUpperCase() === "INCREASE" || type.toUpperCase() === "IN" || type.toUpperCase() === "ADDITION";
        
        return (
          <div className="flex items-center gap-1.5 font-semibold">
            {isAddition ? (
              <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
                +{qty}
              </Badge>
            ) : (
              <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700">
                -{qty}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "adjustmentDate",
      header: "Date",
      cell: ({ row }) => {
        const dateStr = row.original.adjustmentDate;
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
                  <DropdownMenuItem onClick={() => onComplete(item)}>
                    <CheckCircle2Icon className="mr-2 size-4 text-emerald-600" />
                    Complete
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onCancel(item)} className="text-rose-600">
                    <XCircleIcon className="mr-2 size-4" />
                    Cancel
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
