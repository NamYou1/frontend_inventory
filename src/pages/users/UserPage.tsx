import { useState, useCallback, useMemo } from "react";
import { PlusIcon } from "lucide-react";
import { getUser } from "@/utils/auth";

// Hooks
import { usePagination } from "@/hooks/usePagination";
import { useDebounce } from "@/hooks/useDebounce";
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "@/hooks/useUser";

// Core Components
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/common/DataTable";
import { PaginationControls } from "@/components/common/PaginationControls";

// Feature Components & Domain Types
import { getColumns } from "@/pages/users/columns";
import { UserFilterBar } from "@/pages/users/UserFilterBar";
import { UserFormDialog } from "@/pages/users/UserFormDialog";
import { DeleteConfirm } from "@/components/DeleteConfirm";
import type { IUser, UserForm } from "@/types/User.type";

export default function UserPage() {
  // ── Pagination Framework ──────────────────────────────────────────────────
  const {
    page,
    size,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    changeSize,
    resetPage,
  } = usePagination();

  // ── Reactive Searching & Filter States ────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 400);

  // Memoized payload criteria to limit query triggers
  const filter = useMemo(
    () => ({
      page,
      size,
      ...(debouncedQuery && { username: debouncedQuery }),
    }),
    [page, size, debouncedQuery],
  );

  // ── Queries & Async State Management ──────────────────────────────────────
  const { data, isLoading } = useUsers(filter);
  const users = useMemo(() => {
    const rawUsers = data?.payload?.data ?? [];
    const currentUser = getUser();
    const isSuperAdmin = currentUser?.roles.includes("ROLE_SUPER_ADMIN");
    const isStoreAdmin = currentUser?.roles.includes("ROLE_ADMIN") && !isSuperAdmin;
    const storeId = currentUser?.storeId;

    if (isStoreAdmin && storeId) {
      return rawUsers.filter((u) => u.storeId === storeId);
    }
    return rawUsers;
  }, [data]);
  const pagination = data?.payload?.content;

  const createMut = useCreateUser();
  const updateMut = useUpdateUser();
  const deleteMut = useDeleteUser();

  // ── Presentation Overlay States (Dialogs) ─────────────────────────────────
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingItem, setEditingItem] = useState<IUser | null>(null);
  const [deletingItem, setDeletingItem] = useState<IUser | null>(null);

  // ── Actions & Context Callbacks ───────────────────────────────────────────
  const openCreate = () => {
    setFormMode("create");
    setEditingItem(null);
    setFormOpen(true);
  };

  const openEdit = useCallback((user: IUser) => {
    setFormMode("edit");
    setEditingItem(user);
    setFormOpen(true);
  }, []);

  const openDelete = useCallback((user: IUser) => {
    setDeletingItem(user);
    setDeleteOpen(true);
  }, []);

  // ── Core Mutation Submissions ──────────────────────────────────────────────
  const handleFormSubmit = (formData: UserForm) => {
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
          <h1 className="text-2xl font-bold tracking-tight">Staff & Users</h1>
          <p className="text-sm text-muted-foreground">
            Manage administrative staff, store operators, and system accounts
          </p>
        </div>
        <Button onClick={openCreate} className="w-fit">
          <PlusIcon className="mr-2 size-4" />
          Add User Account
        </Button>
      </div>

      {/* ── Query/Filter Interactive Controls ── */}
      <UserFilterBar
        search={searchQuery}
        onSearchChange={(value) => {
          setSearchQuery(value);
          resetPage();
        }}
      />

      {/* ── Tabular Matrix Layout View ── */}
      <DataTable
        data={users}
        columns={columns}
        loading={isLoading}
      />

      {/* ── Dynamic Pagination Controller Context ── */}
      {pagination && (
        <PaginationControls
          pagination={pagination}
          page={page}
          size={size}
          onNext={nextPage}
          onPrev={prevPage}
          onFirst={firstPage}
          onLast={() => lastPage(pagination.totalPages)}
          onSizeChange={changeSize}
        />
      )}

      {/* ── Form Dialog Overlay ── */}
      <UserFormDialog
        open={formOpen}
        mode={formMode}
        user={editingItem}
        loading={createMut.isPending || updateMut.isPending}
        onSubmit={handleFormSubmit}
        onClose={() => setFormOpen(false)}
      />

      {/* ── Destructive Delete Overlay Confirmation ── */}
      <DeleteConfirm
        open={deleteOpen}
        item={deletingItem}
        entityLabel="User Account"
        meta={
          deletingItem
            ? [
              { label: "Username", value: deletingItem.username },
              { label: "Email", value: deletingItem.email },
              { label: "Active", value: deletingItem.isActive ? "Yes" : "No" },
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
