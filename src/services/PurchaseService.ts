import api from "@/api/axios";
import type { PurchaseFilter, IPurchase } from "@/types/Purchase.type";
import type { ApiSpringPageResponse } from "@/utils/Pagination";

export const PurchaseService = {
  getAll: (filter: PurchaseFilter = {}): Promise<ApiSpringPageResponse<IPurchase>> =>
    api.get("purchases", {
      params: {
        page: filter.page,
        size: filter.size,
        ...(filter.status && { status: filter.status }),
      },
    }).then((res) => res.data),

  getById: (id: number) =>
    api.get(`purchases/${id}`).then((res) => res.data),

  approve: (id: number) =>
    api.patch(`purchases/${id}/approve`).then((res) => res.data),

  complete: (id: number) =>
    api.patch(`purchases/${id}/complete`).then((res) => res.data),

  cancel: (id: number) =>
    api.patch(`purchases/${id}/cancel`).then((res) => res.data),

  create: (data: any) =>
    api.post("purchases", data).then((res) => res.data),

  delete: (id: number) =>
    api.delete(`purchases/${id}`).then((res) => res.data),
};
