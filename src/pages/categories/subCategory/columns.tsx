import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ISubCategory } from "@/types/SubCategory.type";
import type { ColumnDef } from "@tanstack/react-table";
import { StatusBadge } from "@/utils/Statusbadge";
import { EllipsisVerticalIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { Link } from "react-router-dom";

export interface SubCategoryColumnActions {
  onEdit: (subCategory: ISubCategory) => void;
  onDelete: (subCategory: ISubCategory) => void;
}

export function getColumns({ onEdit, onDelete }: SubCategoryColumnActions): ColumnDef<ISubCategory>[] {
  return [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground">
          #{row.original.id}
        </span>
      ),
    },
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => (
        <span className="font-mono text-xs font-semibold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
          {row.original.code}
        </span>
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <span className="font-medium text-slate-900 dark:text-slate-100">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "categoryName",
      header: "Category",
      cell: ({ row }) => {
        const catName = row.original.categoryName;
        if (!catName) return <span className="text-muted-foreground">—</span>;
        return (
          <Link
            to={`/category?search=${encodeURIComponent(catName)}`}
            className="inline-flex items-center gap-1.5 font-medium px-2 py-0.5 rounded text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100 hover:text-indigo-800 transition-colors dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-900/50 dark:hover:bg-indigo-950/60 dark:hover:text-indigo-300"
          >
            {catName}
          </Link>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge status={row.original.status} />
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const subCategory = row.original;
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
              <DropdownMenuItem onClick={() => onEdit(subCategory)}>
                <PencilIcon className="mr-2 size-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => onDelete(subCategory)}
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
