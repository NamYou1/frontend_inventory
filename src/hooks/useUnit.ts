import { UnitService } from "@/services/UnitService";
import type { UnitFilter, UnitForm } from "@/types/Unit.type";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";

export const unitKeys = {
  all: ["units"] as const,
  lists: () => [...unitKeys.all, "list"] as const,
  list: (filter: UnitFilter) => [...unitKeys.lists(), filter] as const,
  detail: (id: number) => [...unitKeys.all, "detail", id] as const,
};

export function useUnits(filter: UnitFilter = {}) {
  return useQuery({
    queryKey: unitKeys.list(filter),
    queryFn: () => UnitService.getAll(filter),
    placeholderData: keepPreviousData,
  });
}

export function useUnitDetail(id: number) {
  return useQuery({
    queryKey: unitKeys.detail(id),
    queryFn: () => UnitService.getById(id),
    enabled: !!id,
  });
}

export function useCreateUnit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: UnitService.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: unitKeys.lists() }),
  });
}

export function useUpdateUnit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UnitForm }) =>
      UnitService.update(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: unitKeys.lists() });
      qc.invalidateQueries({ queryKey: unitKeys.detail(id) });
    },
  });
}

export function useDeleteUnit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: UnitService.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: unitKeys.lists() }),
  });
}
