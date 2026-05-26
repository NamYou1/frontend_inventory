import { useState, useCallback, useMemo } from "react";
import { PlusIcon } from "lucide-react";

// Hooks
import { usePagination } from "@/hooks/usePagination";
import { useDebounce } from "@/hooks/useDebounce";
import {
  useSubCategories,
  useCreateSubCategory,
  useUpdateSubCategory,
  useDeleteSubCategory,
} from "@/hooks/Categoryies/useSubCategory";
import { useCategories } from "@/hooks/Categoryies/useCategory";

// Core Components
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/common/DataTable";
import { PaginationControls } from "@/components/common/PaginationControls";
import { DeleteConfirm } from "@/components/DeleteConfirm";

// Feature Components & Domain Types
import { getColumns } from "@/pages/categories/subCategory/columns";
import { SubCategoryFilterBar } from "@/pages/categories/subCategory/SubCategoryFilterBar";
import { SubCategoryFormDialog } from "@/pages/categories/subCategory/SubCategoryFormDialog";
import type { ISubCategory, SubCategoryForm } from "@/types/SubCategory.type";

export default function SubCategoryPage() {
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
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const debouncedSearch = useDebounce(searchName, 400);

  // Memoized payload criteria to limit query triggers
  const filter = useMemo(
    () => ({
      page,
      size,
      ...(debouncedSearch && { name: debouncedSearch }),
      ...(statusFilter !== "ALL" && { status: statusFilter }),
      ...(categoryFilter !== "ALL" && { categoryId: Number(categoryFilter) }),
    }),
    [page, size, debouncedSearch, statusFilter, categoryFilter],
  );

  // ── Queries & Async State Management ──────────────────────────────────────
  const { data, isLoading } = useSubCategories(filter);
  const subCategories = useMemo(() => data?.payload?.data ?? [], [data]);
  const pagination = data?.payload?.content;

  // Fetch all categories for filter and form choice
  const { data: categoriesData } = useCategories({ size: 1000 });
  const categories = useMemo(() => categoriesData?.payload?.data ?? [], [categoriesData]);

  const createMut = useCreateSubCategory();
  const updateMut = useUpdateSubCategory();
  const deleteMut = useDeleteSubCategory();

  // ── Presentation Overlay States (Dialogs) ─────────────────────────────────
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingItem, setEditingItem] = useState<ISubCategory | null>(null);
  const [deletingItem, setDeletingItem] = useState<ISubCategory | null>(null);

  // ── Actions & Context Callbacks ───────────────────────────────────────────
  const openCreate = () => {
    setFormMode("create");
    setEditingItem(null);
    setFormOpen(true);
  };

  const openEdit = useCallback((sub: ISubCategory) => {
    setFormMode("edit");
    setEditingItem(sub);
    setFormOpen(true);
  }, []);

  const openDelete = useCallback((sub: ISubCategory) => {
    setDeletingItem(sub);
    setDeleteOpen(true);
  }, []);

  // ── Core Mutation Submissions ──────────────────────────────────────────────
  const handleFormSubmit = (formData: SubCategoryForm) => {
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

  const handleResetFilters = () => {
    setSearchName("");
    setStatusFilter("ALL");
    setCategoryFilter("ALL");
    resetPage();
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
          <h1 className="text-2xl font-bold tracking-tight">Subcategories</h1>
          <p className="text-sm text-muted-foreground">
            Manage your product subcategories and their connections to main categories.
          </p>
        </div>
        <Button onClick={openCreate} className="w-fit">
          <PlusIcon className="mr-2 size-4" />
          Add Subcategory
        </Button>
      </div>

      {/* ── Query/Filter Interactive Form Controls ── */}
      <SubCategoryFilterBar
        search={searchName}
        status={statusFilter}
        categoryId={categoryFilter}
        categories={categories}
        onSearchChange={(value) => {
          setSearchName(value);
          resetPage();
        }}
        onStatusChange={(value) => {
          setStatusFilter(value);
          resetPage();
        }}
        onCategoryChange={(value) => {
          setCategoryFilter(value);
          resetPage();
        }}
        onReset={handleResetFilters}
      />

      {/* ── Tabular Matrix Layout View ── */}
      <DataTable
        data={subCategories}
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
      <SubCategoryFormDialog
        open={formOpen}
        mode={formMode}
        subCategory={editingItem}
        categories={categories}
        loading={createMut.isPending || updateMut.isPending}
        onSubmit={handleFormSubmit}
        onClose={() => setFormOpen(false)}
      />

      {/* ── Destructive Delete Overlay Confirmation ── */}
      <DeleteConfirm
        open={deleteOpen}
        item={deletingItem}
        entityLabel="Subcategory"
        meta={
          deletingItem
            ? [
              { label: "Code", value: deletingItem.code },
              { label: "Category", value: deletingItem.categoryName || "—" },
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
