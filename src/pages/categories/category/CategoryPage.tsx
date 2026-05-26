import { useState, useCallback, useMemo } from "react";
import { PlusIcon } from "lucide-react";
import { useSearchParams } from "react-router-dom";

// Hooks
import { usePagination } from "@/hooks/usePagination";
import { useDebounce } from "@/hooks/useDebounce";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/Categoryies/useCategory";

// Core Components
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/common/DataTable";
import { PaginationControls } from "@/components/common/PaginationControls";

// Feature Components & Domain Types
import { getColumns } from "@/pages/categories/category/columns";
import { CategoryFilterBar } from "@/pages/categories/category/CategoryFilterBar";
import { CategoryFormDialog } from "@/pages/categories/category/CategoryFormDialog";
import { DeleteConfirm } from "@/components/DeleteConfirm";
import type { ICategory, CategoryForm } from "@/types/Category.type";

export default function CategoryPage() {
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

  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  // ── Reactive Searching & Filter States ────────────────────────────────────
  const [searchName, setSearchName] = useState(initialSearch);
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
  const { data, isLoading } = useCategories(filter);
  const categories = useMemo(() => data?.payload?.data ?? [], [data]);
  const pagination = data?.payload?.content;

  const createMut = useCreateCategory();
  const updateMut = useUpdateCategory();
  const deleteMut = useDeleteCategory();

  // ── Presentation Overlay States (Dialogs) ─────────────────────────────────
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingItem, setEditingItem] = useState<ICategory | null>(null);
  const [deletingItem, setDeletingItem] = useState<ICategory | null>(null);

  // ── Actions & Context Callbacks ───────────────────────────────────────────
  const openCreate = () => {
    setFormMode("create");
    setEditingItem(null);
    setFormOpen(true);
  };

  const openEdit = useCallback((cat: ICategory) => {
    setFormMode("edit");
    setEditingItem(cat);
    setFormOpen(true);
  }, []);

  const openDelete = useCallback((cat: ICategory) => {
    setDeletingItem(cat);
    setDeleteOpen(true);
  }, []);

  // ── Core Mutation Submissions ──────────────────────────────────────────────
  const handleFormSubmit = (formData: CategoryForm) => {
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
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
          <p className="text-sm text-muted-foreground">
            Manage your product categories
          </p>
        </div>
        <Button onClick={openCreate} className="w-fit">
          <PlusIcon className="mr-2 size-4" />
          Add Category
        </Button>
      </div>

      {/* ── Query/Filter Interactive Form Controls ── */}
      <CategoryFilterBar
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
        data={categories}
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
      <CategoryFormDialog
        open={formOpen}
        mode={formMode}
        category={editingItem}
        loading={createMut.isPending || updateMut.isPending}
        onSubmit={handleFormSubmit}
        onClose={() => setFormOpen(false)}
      />

      {/* ── Destructive Delete Overlay Confirmation ── */}
      <DeleteConfirm
        open={deleteOpen}
        item={deletingItem}
        entityLabel="Category"
        meta={
          deletingItem
            ? [
              { label: "ID", value: String(deletingItem.id) },
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