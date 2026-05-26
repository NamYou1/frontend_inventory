import api from "@/api/axios";
import type { SaleFilter, ISale } from "@/types/Sale.type";
import type { ApiSpringPageResponse } from "@/utils/Pagination";

export const SaleService = {
  getAll: (filter: SaleFilter = {}): Promise<ApiSpringPageResponse<ISale>> =>
    api.get("sales", {
      params: {
        page: filter.page,
        size: filter.size,
        ...(filter.status && { status: filter.status }),
      },
    }).then((res) => res.data),

  getById: (id: number) =>
    api.get(`sales/${id}`).then((res) => res.data),

  complete: (id: number) =>
    api.patch(`sales/${id}/complete`).then((res) => res.data),

  cancel: (id: number) =>
    api.patch(`sales/${id}/cancel`).then((res) => res.data),

  returnSale: (id: number) =>
    api.patch(`sales/${id}/return`).then((res) => res.data),

  create: (data: any) =>
    api.post("sales", data).then((res) => res.data),

  delete: (id: number) =>
    api.delete(`sales/${id}`).then((res) => res.data),
};
