import { useState, useCallback, useMemo } from "react";
import { PlusIcon } from "lucide-react";

// Hooks
import { usePagination } from "@/hooks/usePagination";
import { useDebounce } from "@/hooks/useDebounce";
import {
  usePurchases,
  useApprovePurchase,
  useCompletePurchase,
  useCancelPurchase,
  useCreatePurchase,
  useDeletePurchase,
} from "@/hooks/usePurchase";
import { useSuppliers } from "@/hooks/useSupplier";
import { useSellers } from "@/hooks/useSeller";
import { useStores } from "@/hooks/useStore";
import { useProducts } from "@/hooks/useProduct";

// Core Components
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/common/DataTable";
import { PaginationControls } from "@/components/common/PaginationControls";
import { DeleteConfirm } from "@/components/DeleteConfirm";

// Feature Components & Domain Types
import { getColumns } from "@/pages/purchases/columns";
import { PurchaseFilterBar } from "@/pages/purchases/PurchaseFilterBar";
import { PurchaseDetailsDialog } from "@/pages/purchases/PurchaseDetailsDialog";
import { PurchaseFormDialog } from "@/pages/purchases/PurchaseFormDialog";
import type { IPurchase } from "@/types/Purchase.type";

export default function PurchasePage() {
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
  const { data, isLoading } = usePurchases(filter);
  
  // Custom local filter to allow searching reference or supplierName
  const purchases = useMemo(() => {
    const rawData = data?.payload?.content ?? [];
    if (!debouncedSearch) return rawData;
    const query = debouncedSearch.toLowerCase();
    return rawData.filter(
      (item) =>
        item.reference?.toLowerCase().includes(query) ||
        item.supplierName?.toLowerCase().includes(query) ||
        item.storeName?.toLowerCase().includes(query)
    );
  }, [data, debouncedSearch]);

  // Convert raw Spring Page pagination into standard UI structure
  const pagination = useMemo(() => {
    if (!data?.payload) return null;
    const p = data.payload;
    return {
      pageNumber: p.number,
      pageSize: p.size,
      totalPages: p.totalPages,
      totalElements: p.totalElements,
      numberOfElements: p.numberOfElements,
      first: p.first,
      last: p.last,
      empty: p.empty,
    };
  }, [data]);

  // Fetch lists for creation form dropdowns
  const { data: storesData } = useStores({ size: 1000 });
  const { data: suppliersData } = useSuppliers({ size: 1000 });
  const { data: sellersData } = useSellers({ size: 1000 });
  const { data: productsData } = useProducts({ size: 1000 });

  const stores = useMemo(() => storesData?.payload?.data ?? [], [storesData]);
  const suppliers = useMemo(() => suppliersData?.payload?.data ?? [], [suppliersData]);
  const sellers = useMemo(() => sellersData?.payload?.data ?? [], [sellersData]);
  const products = useMemo(() => productsData?.payload?.data ?? [], [productsData]);

  const approveMut = useApprovePurchase();
  const completeMut = useCompletePurchase();
  const cancelMut = useCancelPurchase();
  const createMut = useCreatePurchase();
  const deleteMut = useDeletePurchase();

  // ── Presentation Overlay States (Dialogs) ─────────────────────────────────
  const [detailOpen, setDetailOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IPurchase | null>(null);

  // ── Actions & Context Callbacks ───────────────────────────────────────────
  const openDetails = useCallback((p: IPurchase) => {
    setSelectedItem(p);
    setDetailOpen(true);
  }, []);

  const openDelete = useCallback((p: IPurchase) => {
    setSelectedItem(p);
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
          <h1 className="text-2xl font-bold tracking-tight">Purchase Orders</h1>
          <p className="text-sm text-muted-foreground">
            Manage corporate supplier procurement, order approvals, and shipment records.
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)} className="w-fit">
          <PlusIcon className="mr-2 size-4" />
          Add Purchase Order
        </Button>
      </div>

      {/* ── Query/Filter Interactive Form Controls ── */}
      <PurchaseFilterBar
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
        data={purchases}
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
      <PurchaseFormDialog
        open={formOpen}
        stores={stores}
        suppliers={suppliers}
        sellers={sellers}
        products={products}
        loading={createMut.isPending}
        onSubmit={handleCreateSubmit}
        onClose={() => setFormOpen(false)}
      />

      {/* ── Details Dialog Overlay ── */}
      <PurchaseDetailsDialog
        open={detailOpen}
        purchase={selectedItem}
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
        entityLabel="Purchase Order"
        meta={
          selectedItem
            ? [
                { label: "Reference", value: selectedItem.reference },
                { label: "Supplier", value: selectedItem.supplierName },
                { label: "Grand Total", value: `$${selectedItem.grandTotal}` },
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
