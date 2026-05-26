import { SupplierService } from "@/services/SupplierService";
import type { SupplierFilter } from "@/types/Supplier.type";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

export const supplierKeys = {
  all: ["suppliers"] as const,
  lists: () => [...supplierKeys.all, "list"] as const,
  list: (filter: SupplierFilter) => [...supplierKeys.lists(), filter] as const,
};

export function useSuppliers(filter: SupplierFilter = {}) {
  return useQuery({
    queryKey: supplierKeys.list(filter),
    queryFn: () => SupplierService.getAll(filter),
    placeholderData: keepPreviousData,
  });
}
