import { useState, useCallback, useMemo } from "react";
import { PlusIcon } from "lucide-react";

// Hooks
import { usePagination } from "@/hooks/usePagination";
import { useDebounce } from "@/hooks/useDebounce";
import {
  useStores,
  useCreateStore,
  useUpdateStore,
  useDeleteStore,
} from "@/hooks/useStore";

// Core Components
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/common/DataTable";
import { PaginationControls } from "@/components/common/PaginationControls";

// Feature Components & Domain Types
import { getColumns } from "@/pages/store/columns";
import { StoreFilterBar } from "@/pages/store/StoreFilterBar";
import { StoreFormDialog } from "@/pages/store/StoreFormDialog";
import { DeleteConfirm } from "@/components/DeleteConfirm";
import type { IStore, StoreForm } from "@/types/Store.type";
import { getUser } from "@/utils/auth";

export default function StorePage() {
  const currentUser = getUser();
  const isSuperAdmin = currentUser?.roles.includes("ROLE_SUPER_ADMIN");
  const isStoreAdmin = currentUser?.roles.includes("ROLE_ADMIN") && !isSuperAdmin;
  const storeId = currentUser?.storeId;
  const isAdmin = currentUser?.roles.includes("ROLE_ADMIN");

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
  const [searchName, setSearchName] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const debouncedName = useDebounce(searchName, 400);

  // Memoized payload criteria to limit query triggers
  const filter = useMemo(
    () => ({
      page,
      size,
      ...(debouncedName && { name: debouncedName }),
      ...(statusFilter !== "ALL" && { status: statusFilter }),
    }),
    [page, size, debouncedName, statusFilter],
  );

  // ── Queries & Async State Management ──────────────────────────────────────
  const { data, isLoading } = useStores(filter);
  const stores = useMemo(() => {
    const rawStores = data?.payload?.data ?? [];
    if (isStoreAdmin && storeId) {
      return rawStores.filter(s => s.id === storeId);
    }
    return rawStores;
  }, [data, isStoreAdmin, storeId]);
  const pagination = data?.payload?.content;

  const createMut = useCreateStore();
  const updateMut = useUpdateStore();
  const deleteMut = useDeleteStore();

  // ── Presentation Overlay States (Dialogs) ─────────────────────────────────
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingItem, setEditingItem] = useState<IStore | null>(null);
  const [deletingItem, setDeletingItem] = useState<IStore | null>(null);

  // ── Actions & Context Callbacks ───────────────────────────────────────────
  const openCreate = () => {
    setFormMode("create");
    setEditingItem(null);
    setFormOpen(true);
  };

  const openEdit = useCallback((store: IStore) => {
    setFormMode("edit");
    setEditingItem(store);
    setFormOpen(true);
  }, []);

  const openDelete = useCallback((store: IStore) => {
    setDeletingItem(store);
    setDeleteOpen(true);
  }, []);

  // ── Core Mutation Submissions ──────────────────────────────────────────────
  const handleFormSubmit = (formData: StoreForm) => {
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
          <h1 className="text-2xl font-bold tracking-tight">Stores</h1>
          <p className="text-sm text-muted-foreground">
            {isAdmin 
              ? "Manage your assigned retail store outlet" 
              : "Manage and register your corporate retail outlets"}
          </p>
        </div>
        {!isStoreAdmin && (
          <Button onClick={openCreate} className="w-fit">
            <PlusIcon className="mr-2 size-4" />
            Add Store
          </Button>
        )}
      </div>

      {/* ── Query/Filter Interactive Form Controls ── */}
      <StoreFilterBar
        search={searchName}
        status={statusFilter}
        onSearchChange={(value) => {
          setSearchName(value);
          resetPage();
        }}
        onStatusChange={(value) => {
          setStatusFilter(value);
          resetPage();
        }}
      />

      {/* ── Tabular Matrix Layout View ── */}
      <DataTable
        data={stores}
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
      <StoreFormDialog
        open={formOpen}
        mode={formMode}
        store={editingItem}
        loading={createMut.isPending || updateMut.isPending}
        onSubmit={handleFormSubmit}
        onClose={() => setFormOpen(false)}
      />

      {/* ── Destructive Delete Overlay Confirmation ── */}
      <DeleteConfirm
        open={deleteOpen}
        item={deletingItem}
        entityLabel="Store"
        meta={
          deletingItem
            ? [
              { label: "ID", value: String(deletingItem.id) },
              { label: "Code", value: deletingItem.code },
              { label: "Status", value: deletingItem.status },
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
