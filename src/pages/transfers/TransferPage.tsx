import { useState, useCallback, useMemo } from "react";
import { PlusIcon } from "lucide-react";

// Hooks
import { usePagination } from "@/hooks/usePagination";
import { useDebounce } from "@/hooks/useDebounce";
import {
  useTransfers,
  useApproveTransfer,
  useCompleteTransfer,
  useCancelTransfer,
  useCreateTransfer,
  useDeleteTransfer,
} from "@/hooks/useTransfer";
import { useStores } from "@/hooks/useStore";
import { useProducts } from "@/hooks/useProduct";

// Core Components
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/common/DataTable";
import { PaginationControls } from "@/components/common/PaginationControls";
import { DeleteConfirm } from "@/components/DeleteConfirm";

// Feature Components & Domain Types
import { getColumns } from "@/pages/transfers/columns";
import { TransferFilterBar } from "@/pages/transfers/TransferFilterBar";
import { TransferDetailsDialog } from "@/pages/transfers/TransferDetailsDialog";
import { TransferFormDialog } from "@/pages/transfers/TransferFormDialog";
import type { ITransfer } from "@/types/Transfer.type";

export default function TransferPage() {
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
  const { data, isLoading } = useTransfers(filter);
  
  // Custom local filter to allow searching transferNo
  const transfers = useMemo(() => {
    const rawData = data?.payload?.data ?? [];
    if (!debouncedSearch) return rawData;
    const query = debouncedSearch.toLowerCase();
    return rawData.filter(
      (item) => item.transferNo?.toLowerCase().includes(query)
    );
  }, [data, debouncedSearch]);

  const pagination = data?.payload?.content;

  // Fetch store and product catalog for selector
  const { data: storesData } = useStores({ size: 1000 });
  const { data: productsData } = useProducts({ size: 1000 });

  const stores = useMemo(() => storesData?.payload?.data ?? [], [storesData]);
  const products = useMemo(() => productsData?.payload?.data ?? [], [productsData]);

  const approveMut = useApproveTransfer();
  const completeMut = useCompleteTransfer();
  const cancelMut = useCancelTransfer();
  const createMut = useCreateTransfer();
  const deleteMut = useDeleteTransfer();

  // ── Presentation Overlay States (Dialogs) ─────────────────────────────────
  const [detailOpen, setDetailOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ITransfer | null>(null);

  // ── Actions & Context Callbacks ───────────────────────────────────────────
  const openDetails = useCallback((t: ITransfer) => {
    setSelectedItem(t);
    setDetailOpen(true);
  }, []);

  const openDelete = useCallback((t: ITransfer) => {
    setSelectedItem(t);
    setDetailOpen(false);
    setDeleteOpen(true);
  }, []);

  const handleApprove = useCallback((id: number) => {
    approveMut.mutate(id, {
      onSuccess: () => {
        setDetailOpen(false);
        setSelectedItem(null);
      },
    });
  }, [approveMut]);

  const handleComplete = useCallback((id: number) => {
    completeMut.mutate(id, {
      onSuccess: () => {
        setDetailOpen(false);
        setSelectedItem(null);
      },
    });
  }, [completeMut]);

  const handleCancel = useCallback((id: number) => {
    cancelMut.mutate(id, {
      onSuccess: () => {
        setDetailOpen(false);
        setSelectedItem(null);
      },
    });
  }, [cancelMut]);

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
        onApprove: (item) => handleApprove(item.id),
        onComplete: (item) => handleComplete(item.id),
        onCancel: (item) => handleCancel(item.id),
        onDelete: openDelete,
      }),
    [openDetails, handleApprove, handleComplete, handleCancel, openDelete],
  );

  return (
    <div className="flex flex-col gap-6 px-4 py-6 lg:px-6">
      {/* ── Heading Header Module ── */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Stock Transfers</h1>
          <p className="text-sm text-muted-foreground">
            Manage inventory transfers, outlet replenishments, and warehouse shipments.
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)} className="w-fit">
          <PlusIcon className="mr-2 size-4" />
          Add Transfer Order
        </Button>
      </div>

      {/* ── Query/Filter Interactive Form Controls ── */}
      <TransferFilterBar
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
        data={transfers}
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
      <TransferFormDialog
        open={formOpen}
        stores={stores}
        products={products}
        loading={createMut.isPending}
        onSubmit={handleCreateSubmit}
        onClose={() => setFormOpen(false)}
      />

      {/* ── Details Dialog Overlay ── */}
      <TransferDetailsDialog
        open={detailOpen}
        transfer={selectedItem}
        actionLoading={approveMut.isPending || completeMut.isPending || cancelMut.isPending}
        onApprove={handleApprove}
        onComplete={handleComplete}
        onCancel={handleCancel}
        onClose={() => {
          setDetailOpen(false);
          setSelectedItem(null);
        }}
      />

      {/* ── Destructive Delete Overlay Confirmation ── */}
      <DeleteConfirm
        open={deleteOpen}
        item={selectedItem}
        entityLabel="Stock Transfer"
        meta={
          selectedItem
            ? [
                { label: "Transfer No", value: selectedItem.transferNo },
                { label: "From Store ID", value: String(selectedItem.fromStoreId) },
                { label: "To Store ID", value: String(selectedItem.toStoreId) },
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
