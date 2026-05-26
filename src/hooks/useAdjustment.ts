import { AdjustmentService } from "@/services/AdjustmentService";
import type { AdjustmentFilter } from "@/types/Adjustment.type";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";

export const adjustmentKeys = {
  all: ["adjustments"] as const,
  lists: () => [...adjustmentKeys.all, "list"] as const,
  list: (filter: AdjustmentFilter) => [...adjustmentKeys.lists(), filter] as const,
  detail: (id: number) => [...adjustmentKeys.all, "detail", id] as const,
};

export function useAdjustments(filter: AdjustmentFilter = {}) {
  return useQuery({
    queryKey: adjustmentKeys.list(filter),
    queryFn: () => AdjustmentService.getAll(filter),
    placeholderData: keepPreviousData,
  });
}

export function useAdjustmentDetail(id: number) {
  return useQuery({
    queryKey: adjustmentKeys.detail(id),
    queryFn: () => AdjustmentService.getById(id),
    enabled: !!id,
  });
}

export function useUpdateAdjustmentStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      AdjustmentService.updateStatus(id, status),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: adjustmentKeys.lists() });
      qc.invalidateQueries({ queryKey: adjustmentKeys.detail(id) });
    },
  });
}

export function useCreateAdjustment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: AdjustmentService.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adjustmentKeys.lists() });
    },
  });
}

export function useDeleteAdjustment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: AdjustmentService.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adjustmentKeys.lists() });
    },
  });
}
