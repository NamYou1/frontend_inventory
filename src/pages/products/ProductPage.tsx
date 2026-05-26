import { useState, useCallback, useMemo } from "react";
import { PlusIcon } from "lucide-react";

// Hooks
import { usePagination } from "@/hooks/usePagination";
import { useDebounce } from "@/hooks/useDebounce";
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "@/hooks/useProduct";
import { useCategories } from "@/hooks/Categoryies/useCategory";
import { useSubCategories } from "@/hooks/Categoryies/useSubCategory";
import { useUnits } from "@/hooks/useUnit";

// Core Components
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/common/DataTable";
import { PaginationControls } from "@/components/common/PaginationControls";
import { DeleteConfirm } from "@/components/DeleteConfirm";

// Feature Components & Domain Types
import { getColumns } from "@/pages/products/columns";
import { ProductFilterBar } from "@/pages/products/ProductFilterBar";
import { ProductFormDialog } from "@/pages/products/ProductFormDialog";
import type { IProduct, ProductForm } from "@/types/Product.type";

export default function ProductPage() {
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
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const debouncedSearch = useDebounce(searchQuery, 400);

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
  const { data, isLoading } = useProducts(filter);
  const products = useMemo(() => data?.payload?.data ?? [], [data]);
  const pagination = data?.payload?.content;

  // Query relationships selectors
  const { data: categoriesData } = useCategories({ size: 1000 });
  const categories = useMemo(() => categoriesData?.payload?.data ?? [], [categoriesData]);

  const { data: subCategoriesData } = useSubCategories({ size: 1000 });
  const subCategories = useMemo(() => subCategoriesData?.payload?.data ?? [], [subCategoriesData]);

  const { data: unitsData } = useUnits({ size: 1000 });
  const units = useMemo(() => unitsData?.payload?.data ?? [], [unitsData]);

  const createMut = useCreateProduct();
  const updateMut = useUpdateProduct();
  const deleteMut = useDeleteProduct();

  // ── Presentation Overlay States (Dialogs) ─────────────────────────────────
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingItem, setEditingItem] = useState<IProduct | null>(null);
  const [deletingItem, setDeletingItem] = useState<IProduct | null>(null);

  // ── Actions & Context Callbacks ───────────────────────────────────────────
  const openCreate = () => {
    setFormMode("create");
    setEditingItem(null);
    setFormOpen(true);
  };

  const openEdit = useCallback((prod: IProduct) => {
    setFormMode("edit");
    setEditingItem(prod);
    setFormOpen(true);
  }, []);

  const openDelete = useCallback((prod: IProduct) => {
    setDeletingItem(prod);
    setDeleteOpen(true);
  }, []);

  // ── Core Mutation Submissions ──────────────────────────────────────────────
  const handleFormSubmit = (formData: ProductForm) => {
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
    setSearchQuery("");
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
          <h1 className="text-2xl font-bold tracking-tight">Product Catalog</h1>
          <p className="text-sm text-muted-foreground">
            Register and manage your stock products, sales and cost pricing and alerts.
          </p>
        </div>
        <Button onClick={openCreate} className="w-fit">
          <PlusIcon className="mr-2 size-4" />
          Add Product
        </Button>
      </div>

      {/* ── Query/Filter Interactive Form Controls ── */}
      <ProductFilterBar
        search={searchQuery}
        status={statusFilter}
        categoryId={categoryFilter}
        categories={categories}
        onSearchChange={(value) => {
          setSearchQuery(value);
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
        data={products}
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
      <ProductFormDialog
        open={formOpen}
        mode={formMode}
        product={editingItem}
        categories={categories}
        subCategories={subCategories}
        units={units}
        loading={createMut.isPending || updateMut.isPending}
        onSubmit={handleFormSubmit}
        onClose={() => setFormOpen(false)}
      />

      {/* ── Destructive Delete Overlay Confirmation ── */}
      <DeleteConfirm
        open={deleteOpen}
        item={deletingItem}
        entityLabel="Product"
        meta={
          deletingItem
            ? [
                { label: "ID", value: String(deletingItem.id) },
                { label: "SKU / Code", value: deletingItem.code },
                { label: "Name", value: deletingItem.name },
                { label: "Sale Price", value: `$${deletingItem.salePrice}` },
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
