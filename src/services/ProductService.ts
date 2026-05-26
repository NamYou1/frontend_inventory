import api from "@/api/axios";
import type { ProductFilter, ProductForm, IProduct } from "@/types/Product.type";
import type { ApiResponse } from "@/utils/Pagination";

export const ProductService = {
  getAll: (filter: ProductFilter = {}): Promise<ApiResponse<IProduct[]>> =>
    api.get("product", {
      params: {
        page: filter.page,
        size: filter.size,
        ...(filter.name && { name: filter.name }),
        ...(filter.status && { status: filter.status }),
      },
    }).then((res) => res.data),

  getById: (id: number) =>
    api.get(`product/${id}`).then((res) => res.data),

  create: (data: ProductForm) =>
    api.post("product", data).then((res) => res.data),

  update: (id: number, data: ProductForm) =>
    api.put(`product/${id}`, data).then((res) => res.data),

  delete: (id: number) =>
    api.post(`product/${id}`).then((res) => res.data),
};
