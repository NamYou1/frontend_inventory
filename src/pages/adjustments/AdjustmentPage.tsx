import { useState, useCallback, useMemo } from "react";
import { PlusIcon } from "lucide-react";

// Hooks
import { usePagination } from "@/hooks/usePagination";
import { useDebounce } from "@/hooks/useDebounce";
import {
  useAdjustments,
  useUpdateAdjustmentStatus,
  useCreateAdjustment,
  useDeleteAdjustment,
} from "@/hooks/useAdjustment";
import { useStores } from "@/hooks/useStore";
import { useProducts } from "@/hooks/useProduct";

// Core Components
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/common/DataTable";
import { PaginationControls } from "@/components/common/PaginationControls";
import { DeleteConfirm } from "@/components/DeleteConfirm";

// Feature Components & Domain Types
import { getColumns } from "@/pages/adjustments/columns";
import { AdjustmentFilterBar } from "@/pages/adjustments/AdjustmentFilterBar";
import { AdjustmentDetailsDialog } from "@/pages/adjustments/AdjustmentDetailsDialog";
import { AdjustmentFormDialog } from "@/pages/adjustments/AdjustmentFormDialog";
import type { IAdjustment } from "@/types/Adjustment.type";

export default function AdjustmentPage() {
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
  const debouncedSearch = useDebounce(searchQuery, 400);

  // Memoized payload criteria to limit query triggers
  const filter = useMemo(
    () => ({
      page,
      size,
      ...(statusFilter !== "ALL" && { status: statusFilter }),
    }),
    [page, size, statusFilter],
  );

  // ── Queries & Async State Management ──────────────────────────────────────
  const { data, isLoading } = useAdjustments(filter);
  
  // Custom local filter to allow searching referenceNo or productName
  const adjustments = useMemo(() => {
    const rawData = data?.payload?.data ?? [];
    if (!debouncedSearch) return rawData;
    const query = debouncedSearch.toLowerCase();
    return rawData.filter(
      (item) =>
        item.referenceNo?.toLowerCase().includes(query) ||
        item.productName?.toLowerCase().includes(query) ||
        item.storeName?.toLowerCase().includes(query)
    );
  }, [data, debouncedSearch]);

  const pagination = data?.payload?.content;

  // Fetch store and product catalog for selector
  const { data: storesData } = useStores({ size: 1000 });
  const { data: productsData } = useProducts({ size: 1000 });

  const stores = useMemo(() => storesData?.payload?.data ?? [], [storesData]);
  const products = useMemo(() => productsData?.payload?.data ?? [], [productsData]);

  const updateStatusMut = useUpdateAdjustmentStatus();
  const createMut = useCreateAdjustment();
  const deleteMut = useDeleteAdjustment();

  // ── Presentation Overlay States (Dialogs) ─────────────────────────────────
  const [detailOpen, setDetailOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IAdjustment | null>(null);

  // ── Actions & Context Callbacks ───────────────────────────────────────────
  const openDetails = useCallback((adj: IAdjustment) => {
    setSelectedItem(adj);
    setDetailOpen(true);
  }, []);

  const openDelete = useCallback((adj: IAdjustment) => {
    setSelectedItem(adj);
    setDeleteOpen(true);
  }, []);

  const handleUpdateStatus = (id: number, status: string) => {
    updateStatusMut.mutate(
      { id, status },
      {
        onSuccess: () => {
          setDetailOpen(false);
          setSelectedItem(null);
        },
      }
    );
  };

  const handleComplete = useCallback((item: IAdjustment) => {
    updateStatusMut.mutate({ id: item.id, status: "COMPLETED" });
  }, [updateStatusMut]);

  const handleCancel = useCallback((item: IAdjustment) => {
    updateStatusMut.mutate({ id: item.id, status: "CANCELLED" });
  }, [updateStatusMut]);

  const handleCreateSubmit = (formData: any) => {
    createMut.mutate(formData, {
      onSuccess: () => {
        setFormOpen(false);
      },
    });
  };

  const handleDelete = () => {
    if (!selectedItem) return;
    deleteMut.mutate(selectedItem.id, {
      onSuccess: () => {
        setDeleteOpen(false);
        setSelectedItem(null);
      },
    });
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
    resetPage();
  };

  // ── Columns Configurations ────────────────────────────────────────────────
  const columns = useMemo(
    () =>
      getColumns({
        onViewDetails: openDetails,
        onComplete: handleComplete,
        onCancel: handleCancel,
        onDelete: openDelete,
      }),
    [openDetails, handleComplete, handleCancel, openDelete]
  );

  return (
    <div className="flex flex-col gap-6 px-4 py-6 lg:px-6">
      {/* ── Heading Header Module ── */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Stock Adjustments</h1>
          <p className="text-sm text-muted-foreground">
            Review and manage product stock modifications and outlets adjustments.
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)} className="w-fit">
          <PlusIcon className="mr-2 size-4" />
          Add Stock Adjustment
        </Button>
      </div>

      {/* ── Query/Filter Interactive Form Controls ── */}
      <AdjustmentFilterBar
        search={searchQuery}
        status={statusFilter}
        onSearchChange={(value) => {
          setSearchQuery(value);
          resetPage();
        }}
        onStatusChange={(value) => {
          setStatusFilter(value);
          resetPage();
        }}
        onReset={handleResetFilters}
      />

      {/* ── Tabular Matrix Layout View ── */}
      <DataTable
        data={adjustments}
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

      {/* ── Creation Form Dialog ── */}
      <AdjustmentFormDialog
        open={formOpen}
        stores={stores}
        products={products}
        loading={createMut.isPending}
        onSubmit={handleCreateSubmit}
        onClose={() => setFormOpen(false)}
      />

      {/* ── Details Dialog Overlay ── */}
      <AdjustmentDetailsDialog
        open={detailOpen}
        adjustment={selectedItem}
        loading={updateStatusMut.isPending}
        onUpdateStatus={handleUpdateStatus}
        onClose={() => {
          setDetailOpen(false);
          setSelectedItem(null);
        }}
      />

      {/* ── Destructive Delete Overlay Confirmation ── */}
      <DeleteConfirm
        open={deleteOpen}
        item={selectedItem}
        entityLabel="Stock Adjustment"
        meta={
          selectedItem
            ? [
                { label: "Reference No", value: selectedItem.referenceNo },
                { label: "Product", value: selectedItem.productName },
                { label: "Quantity", value: String(selectedItem.quantity) },
              ]
            : []
        }
        loading={deleteMut.isPending}
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleteOpen(false);
          setSelectedItem(null);
        }}
      />
    </div>
  );
}
