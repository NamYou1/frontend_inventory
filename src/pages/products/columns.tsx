import type { IProduct } from "@/types/Product.type";
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
import { EllipsisVerticalIcon, PencilIcon, Trash2Icon, ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface ProductColumnActions {
  onEdit: (product: IProduct) => void;
  onDelete: (product: IProduct) => void;
}

export function getColumns({
  onEdit,
  onDelete,
}: ProductColumnActions): ColumnDef<IProduct>[] {
  return [
    {
      id: "image",
      header: "Product Image",
      cell: ({ row }) => {
        const url = row.original.imageUrl;
        const name = row.original.name || "P";
        return (
          <Avatar className="size-10 border border-border/80 rounded-md bg-muted/40 shadow-sm">
            <AvatarImage src={url} alt={name} className="object-cover" />
            <AvatarFallback className="rounded-md text-xs bg-muted text-muted-foreground font-semibold">
              <ImageIcon className="size-4 opacity-50" />
            </AvatarFallback>
          </Avatar>
        );
      },
    },
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => (
        <Badge variant="outline" className="font-mono text-xs border-primary/20 bg-primary/5 text-primary">
          {row.original.code}
        </Badge>
      ),
    },
    {
      accessorKey: "name",
      header: "Product Name",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-semibold text-foreground leading-none">{row.original.name}</span>
          {row.original.otherName && (
            <span className="text-xs text-muted-foreground mt-0.5">{row.original.otherName}</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "salePrice",
      header: "Sale Price",
      cell: ({ row }) => {
        const val = row.original.salePrice;
        return (
          <span className="font-bold text-emerald-600">
            ${val !== undefined && val !== null ? Number(val).toFixed(2) : "0.00"}
          </span>
        );
      },
    },
    {
      accessorKey: "costPrice",
      header: "Cost Price",
      cell: ({ row }) => {
        const val = row.original.costPrice;
        return (
          <span className="font-medium text-muted-foreground">
            ${val !== undefined && val !== null ? Number(val).toFixed(2) : "0.00"}
          </span>
        );
      },
    },
    {
      id: "category",
      header: "Category & Unit",
      cell: ({ row }) => {
        const cat = row.original.categoryName || "—";
        const sub = row.original.subCategoryName;
        const unit = row.original.unitName || "—";
        return (
          <div className="flex flex-col gap-1 text-xs">
            <span className="text-foreground">
              {cat}
              {sub ? ` › ${sub}` : ""}
            </span>
            <span className="text-muted-foreground italic font-mono">
              Unit: {unit}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status || "ACTIVE";
        return <StatusBadge status={status} />;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const item = row.original;
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
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem onClick={() => onEdit(item)}>
                <PencilIcon className="mr-2 size-4" />
                Edit
              </DropdownMenuItem>
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
