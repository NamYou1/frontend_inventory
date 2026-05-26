import { TransferService } from "@/services/TransferService";
import type { TransferFilter } from "@/types/Transfer.type";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";

export const transferKeys = {
  all: ["transfers"] as const,
  lists: () => [...transferKeys.all, "list"] as const,
  list: (filter: TransferFilter) => [...transferKeys.lists(), filter] as const,
  detail: (id: number) => [...transferKeys.all, "detail", id] as const,
};

export function useTransfers(filter: TransferFilter = {}) {
  return useQuery({
    queryKey: transferKeys.list(filter),
    queryFn: () => TransferService.getAll(filter),
    placeholderData: keepPreviousData,
  });
}

export function useTransferDetail(id: number) {
  return useQuery({
    queryKey: transferKeys.detail(id),
    queryFn: () => TransferService.getById(id),
    enabled: !!id,
  });
}

export function useApproveTransfer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: TransferService.approve,
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: transferKeys.lists() });
      qc.invalidateQueries({ queryKey: transferKeys.detail(id) });
    },
  });
}

export function useCompleteTransfer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: TransferService.complete,
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: transferKeys.lists() });
      qc.invalidateQueries({ queryKey: transferKeys.detail(id) });
    },
  });
}

export function useCancelTransfer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: TransferService.cancel,
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: transferKeys.lists() });
      qc.invalidateQueries({ queryKey: transferKeys.detail(id) });
    },
  });
}

export function useCreateTransfer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: TransferService.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: transferKeys.lists() });
    },
  });
}

export function useDeleteTransfer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: TransferService.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: transferKeys.lists() });
    },
  });
}
