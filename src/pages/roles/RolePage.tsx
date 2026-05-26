import { useState, useCallback, useMemo } from "react";
import { PlusIcon } from "lucide-react";

// Hooks
import {
  useRoles,
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
} from "@/hooks/useRole";

// Core Components
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/common/DataTable";

// Feature Components & Domain Types
import { getColumns } from "@/pages/roles/columns";
import { RoleFormDialog } from "@/pages/roles/RoleFormDialog";
import { DeleteConfirm } from "@/components/DeleteConfirm";
import type { IRole, RoleForm } from "@/types/Role.type";

export default function RolePage() {
  // ── Queries & Async State Management ──────────────────────────────────────
  const { data, isLoading } = useRoles();
  const roles = useMemo(() => data?.payload ?? [], [data]);

  const createMut = useCreateRole();
  const updateMut = useUpdateRole();
  const deleteMut = useDeleteRole();

  // ── Presentation Overlay States (Dialogs) ─────────────────────────────────
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingItem, setEditingItem] = useState<IRole | null>(null);
  const [deletingItem, setDeletingItem] = useState<IRole | null>(null);

  // ── Actions & Context Callbacks ───────────────────────────────────────────
  const openCreate = () => {
    setFormMode("create");
    setEditingItem(null);
    setFormOpen(true);
  };

  const openEdit = useCallback((role: IRole) => {
    setFormMode("edit");
    setEditingItem(role);
    setFormOpen(true);
  }, []);

  const openDelete = useCallback((role: IRole) => {
    setDeletingItem(role);
    setDeleteOpen(true);
  }, []);

  // ── Core Mutation Submissions ──────────────────────────────────────────────
  const handleFormSubmit = (formData: RoleForm) => {
    if (formMode === "create") {
      createMut.mutate(formData, {
        onSuccess: () => {
          setFormOpen(false);
        },
      });
    } else if (editingItem) {
      updateMut.mutate(
        { id: editingItem.id, data: formData },
        {
          onSuccess: () => {
            setFormOpen(false);
          },
        },
      );
    }
  };

  const handleDelete = () => {
    if (!deletingItem) return;
    deleteMut.mutate(deletingItem.id, {
      onSuccess: () => {
        setDeleteOpen(false);
        setDeletingItem(null);
      },
    });
  };

  // ── Columns Configurations ────────────────────────────────────────────────
  const columns = useMemo(
    () => getColumns({ onEdit: openEdit, onDelete: openDelete }),
    [openEdit, openDelete],
  );

  return (
    <div className="flex flex-col gap-6 px-4 py-6 lg:px-6">
      {/* ── Heading Header Module ── */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Security Roles</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Manage system access profiles, assign operational scopes, and map permissions
          </p>
        </div>
        <Button onClick={openCreate} className="w-fit">
          <PlusIcon className="mr-2 size-4" />
          Add Security Role
        </Button>
      </div>

      {/* ── Tabular Matrix Layout View ── */}
      <DataTable
        data={roles}
        columns={columns}
        loading={isLoading}
      />

      {/* ── Form Dialog Overlay ── */}
      <RoleFormDialog
        open={formOpen}
        mode={formMode}
        role={editingItem}
        loading={createMut.isPending || updateMut.isPending}
        onSubmit={handleFormSubmit}
        onClose={() => setFormOpen(false)}
      />

      {/* ── Destructive Delete Overlay Confirmation ── */}
      <DeleteConfirm
        open={deleteOpen}
        item={deletingItem}
        entityLabel="Security Role"
        meta={
          deletingItem
            ? [
              { label: "Code", value: deletingItem.code },
              { label: "Name", value: deletingItem.name },
              { label: "Capabilities Count", value: String(deletingItem.permissionIds?.length || 0) },
            ]
            : []
        }
        loading={deleteMut.isPending}
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleteOpen(false);
          setDeletingItem(null);
        }}
      />
    </div>
  );
}
