import { useState, useCallback, useMemo } from "react";
import { PlusIcon } from "lucide-react";
import { hasPermission } from "@/utils/auth";

// Hooks
import { usePagination } from "@/hooks/usePagination";
import { useDebounce } from "@/hooks/useDebounce";
import {
  useSales,
  useCompleteSale,
  useCancelSale,
  useReturnSale,
  useCreateSale,
  useDeleteSale,
} from "@/hooks/useSale";
import { useStores } from "@/hooks/useStore";
import { useProducts } from "@/hooks/useProduct";

// Core Components
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/common/DataTable";
import { PaginationControls } from "@/components/common/PaginationControls";
import { DeleteConfirm } from "@/components/DeleteConfirm";

// Feature Components & Domain Types
import { getColumns } from "@/pages/sales/columns";
import { SaleFilterBar } from "@/pages/sales/SaleFilterBar";
import { SaleDetailsDialog } from "@/pages/sales/SaleDetailsDialog";
import { SaleFormDialog } from "@/pages/sales/SaleFormDialog";
import type { ISale } from "@/types/Sale.type";

export default function SalePage() {
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
  const { data, isLoading } = useSales(filter);
  
  // Custom local filter to allow searching invoiceNo or storeName
  const sales = useMemo(() => {
    const rawData = data?.payload?.content ?? [];
    if (!debouncedSearch) return rawData;
    const query = debouncedSearch.toLowerCase();
    return rawData.filter(
      (item) =>
        item.invoiceNo?.toLowerCase().includes(query) ||
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

  // Fetch store and product lists for form dialog lookups
  const { data: storesData } = useStores({ size: 1000 });
  const { data: productsData } = useProducts({ size: 1000 });

  const stores = useMemo(() => storesData?.payload?.data ?? [], [storesData]);
  const products = useMemo(() => productsData?.payload?.data ?? [], [productsData]);

  const completeMut = useCompleteSale();
  const cancelMut = useCancelSale();
  const returnMut = useReturnSale();
  const createMut = useCreateSale();
  const deleteMut = useDeleteSale();

  // ── Presentation Overlay States (Dialogs) ─────────────────────────────────
  const [detailOpen, setDetailOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ISale | null>(null);

  // ── Actions & Context Callbacks ───────────────────────────────────────────
  const openDetails = useCallback((s: ISale) => {
    setSelectedItem(s);
    setDetailOpen(true);
  }, []);

  const openDelete = useCallback((s: ISale) => {
    setSelectedItem(s);
    setDetailOpen(false);
    setDeleteOpen(true);
  }, []);

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

  const handleReturn = useCallback((id: number) => {
    returnMut.mutate(id, {
      onSuccess: () => {
        setDetailOpen(false);
        setSelectedItem(null);
      },
    });
  }, [returnMut]);

  const handleCreateSubmit = (formData: any, checkoutType: "HOLD" | "CHECKOUT" = "HOLD") => {
    createMut.mutate(formData, {
      onSuccess: (res) => {
        setFormOpen(false);
        const sale = res?.payload;
        if (checkoutType === "CHECKOUT" && sale && sale.id) {
          completeMut.mutate(sale.id);
        }
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
        onComplete: (item) => handleComplete(item.id),
        onCancel: (item) => handleCancel(item.id),
        onReturn: (item) => handleReturn(item.id),
        onDelete: openDelete,
      }),
    [openDetails, handleComplete, handleCancel, handleReturn, openDelete],
  );

  return (
    <div className="flex flex-col gap-6 px-4 py-6 lg:px-6">
      {/* ── Heading Header Module ── */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sales Orders</h1>
          <p className="text-sm text-muted-foreground">
            Monitor shop customer invoice receipts, complete payouts, and sales return operations.
          </p>
        </div>
        {hasPermission("SALE_CREATE") && (
          <Button onClick={() => setFormOpen(true)} className="w-fit">
            <PlusIcon className="mr-2 size-4" />
            Add Sales Invoice
          </Button>
        )}
      </div>

      {/* ── Query/Filter Interactive Form Controls ── */}
      <SaleFilterBar
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
        data={sales}
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
      <SaleFormDialog
        open={formOpen}
        stores={stores}
        products={products}
        loading={createMut.isPending}
        onSubmit={handleCreateSubmit}
        onClose={() => setFormOpen(false)}
      />

      {/* ── Details Dialog Overlay ── */}
      <SaleDetailsDialog
        open={detailOpen}
        sale={selectedItem}
        actionLoading={completeMut.isPending || cancelMut.isPending || returnMut.isPending}
        onComplete={handleComplete}
        onCancel={handleCancel}
        onReturn={handleReturn}
        onClose={() => {
          setDetailOpen(false);
          setSelectedItem(null);
        }}
      />

      {/* ── Destructive Delete Overlay Confirmation ── */}
      <DeleteConfirm
        open={deleteOpen}
        item={selectedItem}
        entityLabel="Sales Order"
        meta={
          selectedItem
            ? [
                { label: "Invoice No", value: selectedItem.invoiceNo },
                { label: "Store", value: selectedItem.storeName },
                { label: "Total Amount", value: `$${selectedItem.totalAmount}` },
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
