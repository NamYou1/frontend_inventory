import { ProductService } from "@/services/ProductService";
import type { ProductFilter, ProductForm } from "@/types/Product.type";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";

export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filter: ProductFilter) => [...productKeys.lists(), filter] as const,
  detail: (id: number) => [...productKeys.all, "detail", id] as const,
};

export function useProducts(filter: ProductFilter = {}) {
  return useQuery({
    queryKey: productKeys.list(filter),
    queryFn: () => ProductService.getAll(filter),
    placeholderData: keepPreviousData,
  });
}

export function useProductDetail(id: number) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => ProductService.getById(id),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ProductService.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: productKeys.lists() }),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProductForm }) =>
      ProductService.update(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: productKeys.lists() });
      qc.invalidateQueries({ queryKey: productKeys.detail(id) });
    },
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ProductService.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: productKeys.lists() }),
  });
}
