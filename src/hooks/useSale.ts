import { SaleService } from "@/services/SaleService";
import type { SaleFilter } from "@/types/Sale.type";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";

export const saleKeys = {
  all: ["sales"] as const,
  lists: () => [...saleKeys.all, "list"] as const,
  list: (filter: SaleFilter) => [...saleKeys.lists(), filter] as const,
  detail: (id: number) => [...saleKeys.all, "detail", id] as const,
};

export function useSales(filter: SaleFilter = {}) {
  return useQuery({
    queryKey: saleKeys.list(filter),
    queryFn: () => SaleService.getAll(filter),
    placeholderData: keepPreviousData,
  });
}

export function useSaleDetail(id: number) {
  return useQuery({
    queryKey: saleKeys.detail(id),
    queryFn: () => SaleService.getById(id),
    enabled: !!id,
  });
}

export function useCompleteSale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: SaleService.complete,
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: saleKeys.lists() });
      qc.invalidateQueries({ queryKey: saleKeys.detail(id) });
    },
  });
}

export function useCancelSale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: SaleService.cancel,
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: saleKeys.lists() });
      qc.invalidateQueries({ queryKey: saleKeys.detail(id) });
    },
  });
}

export function useReturnSale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: SaleService.returnSale,
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: saleKeys.lists() });
      qc.invalidateQueries({ queryKey: saleKeys.detail(id) });
    },
  });
}

export function useCreateSale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: SaleService.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: saleKeys.lists() });
    },
  });
}

export function useDeleteSale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: SaleService.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: saleKeys.lists() });
    },
  });
}
