import { StoreService } from "@/services/StoreService";
import type { StoreFilter, StoreForm } from "@/types/Store.type";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";

export const storeKeys = {
  all: ["stores"] as const,
  lists: () => [...storeKeys.all, "list"] as const,
  list: (filter: StoreFilter) => [...storeKeys.lists(), filter] as const,
  detail: (id: number) => [...storeKeys.all, "detail", id] as const,
};

export function useStores(filter: StoreFilter = {}) {
  return useQuery({
    queryKey: storeKeys.list(filter),
    queryFn: () => StoreService.getAll(filter),
    placeholderData: keepPreviousData,
  });
}

export function useCreateStore() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: StoreService.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: storeKeys.lists() }),
  });
}

export function useUpdateStore() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: StoreForm }) =>
      StoreService.update(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: storeKeys.lists() });
      qc.invalidateQueries({ queryKey: storeKeys.detail(id) });
    },
  });
}

export function useDeleteStore() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: StoreService.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: storeKeys.lists() }),
  });
}
