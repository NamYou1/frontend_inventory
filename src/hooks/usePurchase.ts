import { PurchaseService } from "@/services/PurchaseService";
import type { PurchaseFilter } from "@/types/Purchase.type";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";

export const purchaseKeys = {
  all: ["purchases"] as const,
  lists: () => [...purchaseKeys.all, "list"] as const,
  list: (filter: PurchaseFilter) => [...purchaseKeys.lists(), filter] as const,
  detail: (id: number) => [...purchaseKeys.all, "detail", id] as const,
};

export function usePurchases(filter: PurchaseFilter = {}) {
  return useQuery({
    queryKey: purchaseKeys.list(filter),
    queryFn: () => PurchaseService.getAll(filter),
    placeholderData: keepPreviousData,
  });
}

export function usePurchaseDetail(id: number) {
  return useQuery({
    queryKey: purchaseKeys.detail(id),
    queryFn: () => PurchaseService.getById(id),
    enabled: !!id,
  });
}

export function useApprovePurchase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: PurchaseService.approve,
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: purchaseKeys.lists() });
      qc.invalidateQueries({ queryKey: purchaseKeys.detail(id) });
    },
  });
}

export function useCompletePurchase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: PurchaseService.complete,
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: purchaseKeys.lists() });
      qc.invalidateQueries({ queryKey: purchaseKeys.detail(id) });
    },
  });
}

export function useCancelPurchase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: PurchaseService.cancel,
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: purchaseKeys.lists() });
      qc.invalidateQueries({ queryKey: purchaseKeys.detail(id) });
    },
  });
}

export function useCreatePurchase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: PurchaseService.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: purchaseKeys.lists() });
    },
  });
}

export function useDeletePurchase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: PurchaseService.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: purchaseKeys.lists() });
    },
  });
}
