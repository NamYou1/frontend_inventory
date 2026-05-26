import type { IUnit } from "@/types/Unit.type";
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
import { EllipsisVerticalIcon, PencilIcon, Trash2Icon, VariableIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface UnitColumnActions {
  onEdit: (unit: IUnit) => void;
  onDelete: (unit: IUnit) => void;
}

export function getColumns({
  onEdit,
  onDelete,
}: UnitColumnActions): ColumnDef<IUnit>[] {
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
        <span className="font-semibold text-foreground">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => (
        <Badge variant="secondary" className="font-mono text-xs">
          {row.original.code}
        </Badge>
      ),
    },
    {
      accessorKey: "baseUnit",
      header: "Base Unit ID",
      cell: ({ row }) => {
        const base = row.original.baseUnit;
        return (
          <span className="text-muted-foreground font-mono text-xs">
            {base ? `#${base}` : "Self"}
          </span>
        );
      },
    },
    {
      accessorKey: "operation",
      header: "Operation / Formula",
      cell: ({ row }) => {
        const op = row.original.operation;
        const val = row.original.operationValue;
        if (!op || op === "NONE") return <span className="text-muted-foreground text-xs italic">No conversion</span>;
        
        return (
          <div className="flex items-center gap-1 text-xs">
            <VariableIcon className="size-3.5 text-primary" />
            <span className="font-medium">
              {op.toUpperCase() === "MULTIPLY" ? "Base Unit × " : "Base Unit ÷ "}
              {val}
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
