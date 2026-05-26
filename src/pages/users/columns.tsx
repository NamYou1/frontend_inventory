import type { IUser } from "@/types/User.type";
import type { ColumnDef } from "@tanstack/react-table";
import { StatusBadge } from "@/utils/Statusbadge";
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
import { getUser } from "@/utils/auth";

export interface UserColumnActions {
  onEdit: (user: IUser) => void;
  onDelete: (user: IUser) => void;
}

export function getColumns({
  onEdit,
  onDelete,
}: UserColumnActions): ColumnDef<IUser>[] {
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
      accessorKey: "username",
      header: "User Details",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium text-slate-800">{row.original.username}</span>
          <span className="text-xs text-slate-500">
            {row.original.firstName} {row.original.lastName}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Contact",
      cell: ({ row }) => (
        <div className="flex flex-col text-xs text-muted-foreground">
          <span>{row.original.email}</span>
          <span>{row.original.phone || "—"}</span>
        </div>
      ),
    },
    {
      accessorKey: "storeName",
      header: "Assigned Store",
      cell: ({ row }) => (
        <span className="text-sm text-slate-600">
          {row.original.storeName || (
            <span className="text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 border border-indigo-200">
              Global Admin
            </span>
          )}
        </span>
      ),
    },
    {
      accessorKey: "roles",
      header: "Roles",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1 max-w-[150px]">
          {row.original.roles.map((role) => (
            <Badge
              key={role}
              variant="outline"
              className="text-[10px] bg-primary/5 text-primary border-primary/20 px-1.5 py-0 rounded"
            >
              {role.replace("ROLE_", "")}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge status={row.original.isActive ? "ACTIVE" : "INACTIVE"} />
      ),
    },
    {
      id: "actions",
      accessorKey: "Actions",
      header: "Actions",
      cell: ({ row }) => {
        const user = row.original;
        const currentUser = getUser();
        const isSuperAdmin = currentUser?.roles.includes("ROLE_SUPER_ADMIN");
        const isStoreAdmin = currentUser?.roles.includes("ROLE_ADMIN") && !isSuperAdmin;

        const isOwnAccount = currentUser?.userId === user.id;
        const isTargetAdminOrSuper = user.roles?.includes("ROLE_SUPER_ADMIN") || user.roles?.includes("ROLE_ADMIN");

        const canEdit = !isStoreAdmin || !isTargetAdminOrSuper || isOwnAccount;
        const canDelete = !isOwnAccount && (!isStoreAdmin || !isTargetAdminOrSuper);

        if (!canEdit && !canDelete) {
          return <span className="text-xs text-muted-foreground font-medium italic">Restricted</span>;
        }

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
              {canEdit && (
                <DropdownMenuItem onClick={() => onEdit(user)} className="cursor-pointer">
                  <PencilIcon className="mr-2 size-4" />
                  Edit
                </DropdownMenuItem>
              )}
              {canDelete && (
                <>
                  {canEdit && <DropdownMenuSeparator />}
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => onDelete(user)}
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
