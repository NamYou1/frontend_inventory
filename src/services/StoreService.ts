import api from "@/api/axios";
import type { StoreFilter, StoreForm, IStore } from "@/types/Store.type";
import type { ApiResponse } from "@/utils/Pagination";

export const StoreService = {
  getAll: (filter: StoreFilter = {}): Promise<ApiResponse<IStore[]>> =>
    api.get("store", {
        params: {
          page: filter.page,
          size: filter.size,
          ...(filter.name && { name: filter.name }),
          ...(filter.code && { code: filter.code }),
          ...(filter.status && { status: filter.status }),
        },
      })
      .then((res) => res.data),

  getById: (id: number): Promise<ApiResponse<IStore>> =>
    api.get(`store/${id}`).then((res) => res.data),

  create: (data: StoreForm): Promise<ApiResponse<IStore>> =>
    api.post("store", data).then((res) => res.data),

  update: (id: number, data: StoreForm): Promise<ApiResponse<IStore>> =>
    api.put(`store/${id}`, data).then((res) => res.data),

  delete: (id: number): Promise<ApiResponse<null>> =>
    api.post(`store/${id}`).then((res) => res.data),
};
