import type { IRole } from "@/types/Role.type";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVerticalIcon, PencilIcon, Trash2Icon } from "lucide-react";

export interface RoleColumnActions {
  onEdit: (role: IRole) => void;
  onDelete: (role: IRole) => void;
}

export function getColumns({
  onEdit,
  onDelete,
}: RoleColumnActions): ColumnDef<IRole>[] {
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
      accessorKey: "name",
      header: "Role Details",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium text-slate-800">{row.original.name}</span>
          <span className="text-xs text-slate-500 font-mono tracking-wide">
            {row.original.code}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <span className="text-sm text-slate-500 block max-w-sm truncate">
          {row.original.description || "—"}
        </span>
      ),
    },
    {
      accessorKey: "permissionCount",
      header: "Privileges Count",
      cell: ({ row }) => {
        const count = row.original.permissionIds?.length || 0;
        return (
          <Badge
            variant="outline"
            className="text-[10px] font-semibold bg-primary/5 text-primary border-primary/20"
          >
            {count} capability{count !== 1 ? "s" : ""}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      accessorKey: "Actions",
      header: "Actions",
      cell: ({ row }) => {
        const role = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-muted-foreground data-[state=open]:bg-muted hover:text-slate-800"
              >
                <EllipsisVerticalIcon className="size-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem onClick={() => onEdit(role)} className="cursor-pointer">
                <PencilIcon className="mr-2 size-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => onDelete(role)}
                className="cursor-pointer text-destructive focus:bg-destructive/10"
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
