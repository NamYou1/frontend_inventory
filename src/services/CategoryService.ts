import api from "@/api/axios";
import type { CategoryFilter, CategoryForm, ICategory } from "@/types/Category.type";
import type { ApiResponse } from "@/utils/Pagination";

export const CategoryService = {
  getAll: (filter: CategoryFilter = {}): Promise<ApiResponse<ICategory[]>> =>
    api
      .get("category", {
        params: {
          page: filter.page,
          size: filter.size,
          ...(filter.name && { name: filter.name }),
          ...(filter.status && { status: filter.status }),
        },
      })
      .then((res) => res.data),

  getById: (id: number): Promise<ApiResponse<ICategory>> =>
    api.get(`category/${id}`).then((res) => res.data),

  create: (data: CategoryForm): Promise<ApiResponse<ICategory>> =>
    api.post("category", data).then((res) => res.data),

  update: (id: number, data: CategoryForm): Promise<ApiResponse<ICategory>> =>
    api.put(`category/${id}`, data).then((res) => res.data),

  delete: (id: number): Promise<ApiResponse<null>> =>
    api.post(`category/${id}`).then((res) => res.data),
};