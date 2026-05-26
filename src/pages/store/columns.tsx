import type { IStore } from "@/types/Store.type";
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
import { EllipsisVerticalIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { getUser } from "@/utils/auth";

export interface StoreColumnActions {
  onEdit: (store: IStore) => void;
  onDelete: (store: IStore) => void;
}

export function getColumns({
  onEdit,
  onDelete,
}: StoreColumnActions): ColumnDef<IStore>[] {
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
      header: "Name",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium text-slate-800">{row.original.name}</span>
          <span className="text-xs text-slate-500 font-mono">{row.original.code}</span>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Contact",
      cell: ({ row }) => (
        <div className="flex flex-col text-xs text-muted-foreground">
          <span>{row.original.email}</span>
          <span>{row.original.phone}</span>
        </div>
      ),
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => {
        const parts = [row.original.city, row.original.state, row.original.country].filter(Boolean);
        return (
          <span className="text-sm text-muted-foreground">
            {parts.join(", ") || "—"}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: "actions",
      accessorKey: "Actions",
      header: "Actions",
      cell: ({ row }) => {
        const store = row.original;
        const currentUser = getUser();
        const isSuperAdmin = currentUser?.roles.includes("ROLE_SUPER_ADMIN");
        const isStoreAdmin = currentUser?.roles.includes("ROLE_ADMIN") && !isSuperAdmin;

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
              <DropdownMenuItem onClick={() => onEdit(store)} className="cursor-pointer">
                <PencilIcon className="mr-2 size-4" />
                Edit
              </DropdownMenuItem>
              {!isStoreAdmin && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => onDelete(store)}
                    className="cursor-pointer text-destructive focus:bg-destructive/10"
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
