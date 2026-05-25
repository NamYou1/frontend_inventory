import { CategoryService } from "@/services/CategoryService";
import type { CategoryFilter, CategoryForm } from "@/types/Category.type";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";



// ─── Keys ─────────────────────────────────────────────────────────────────────

export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  list: (filter: CategoryFilter) => [...categoryKeys.lists(), filter] as const,
  detail: (id: number) => [...categoryKeys.all, "detail", id] as const,
};
 
// ─── useCategories ────────────────────────────────────────────────────────────
 
export function useCategories(filter: CategoryFilter = {}) {
  return useQuery({
    queryKey: categoryKeys.list(filter),
    queryFn: () => CategoryService.getAll(filter),
    placeholderData: keepPreviousData,
  });
}


// export function useCategory(id: number) {
//   return useQuery({
//     queryKey: categoryKeys.detail(id),
//     queryFn: () => CategoryService.getById(id),
//     enabled: !!id,
//   });
// }

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: CategoryService.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: categoryKeys.lists() }),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategoryForm }) =>
      CategoryService.update(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: categoryKeys.lists() });
      qc.invalidateQueries({ queryKey: categoryKeys.detail(id) });
    },
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: CategoryService.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: categoryKeys.lists() }),
  });
}