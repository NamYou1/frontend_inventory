import type { ITransfer } from "@/types/Transfer.type";
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


export interface TransferColumnActions {
  onViewDetails: (transfer: ITransfer) => void;
  onApprove: (transfer: ITransfer) => void;
  onComplete: (transfer: ITransfer) => void;
  onCancel: (transfer: ITransfer) => void;
  onDelete: (transfer: ITransfer) => void;
}

export function getColumns({
  onViewDetails,
  onApprove,
  onComplete,
  onCancel,
  onDelete,
}: TransferColumnActions): ColumnDef<ITransfer>[] {
  return [
    {
      accessorKey: "transferNo",
      header: "Transfer No",
      cell: ({ row }) => (
        <span className="font-mono text-xs font-semibold text-primary">
          {row.original.transferNo}
        </span>
      ),
    },
    {
      accessorKey: "fromStoreId",
      header: "From Store",
      cell: ({ row }) => (
        <span className="text-muted-foreground font-mono text-xs">
          Store #{row.original.fromStoreId}
        </span>
      ),
    },
    {
      accessorKey: "toStoreId",
      header: "To Store",
      cell: ({ row }) => (
        <span className="font-semibold text-foreground font-mono text-xs">
          Store #{row.original.toStoreId}
        </span>
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
      accessorKey: "createdBy",
      header: "Created By",
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.createdBy || "—"}</span>
      ),
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
                    Approve
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onCancel(item)} className="text-rose-600">
                    <XCircleIcon className="mr-2 size-4" />
                    Cancel
                  </DropdownMenuItem>
                </>
              )}

              {isApproved && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onComplete(item)}>
                    <CheckCircle2Icon className="mr-2 size-4 text-primary" />
                    Receive / Complete
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
