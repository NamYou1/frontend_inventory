import api from "@/api/axios";
import type { SellerFilter, SellerForm, ISeller } from "@/types/Seller.type";
import type { ApiResponse } from "@/utils/Pagination";

export const SellerService = {
  getAll: (filter: SellerFilter = {}): Promise<ApiResponse<ISeller[]>> =>
    api.get("seller", {
      params: {
        page: filter.page,
        size: filter.size,
        ...(filter.name && { name: filter.name }),
        ...(filter.status && { status: filter.status }),
      },
    }).then((res) => res.data),

  getById: (id: number) =>
    api.get(`seller/${id}`).then((res) => res.data),

  create: (data: SellerForm) =>
    api.post("seller", data).then((res) => res.data),

  update: (id: number, data: SellerForm) =>
    api.put(`seller/${id}`, data).then((res) => res.data),

  delete: (id: number) =>
    api.post(`seller/${id}`).then((res) => res.data),
};
