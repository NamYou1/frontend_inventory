import api from "@/api/axios";
import type { TransferFilter, ITransfer } from "@/types/Transfer.type";
import type { ApiResponse } from "@/utils/Pagination";

// NOTE: Transfer endpoint is /api/transfers (not /api/v1/transfers)
// Axios baseURL is /api/v1/ so we use relative path ../transfers
export const TransferService = {
  getAll: (filter: TransferFilter = {}): Promise<ApiResponse<ITransfer[]>> =>
    api.get("../transfers", {
      params: {
        page: filter.page,
        size: filter.size,
        ...(filter.status && { status: filter.status }),
      },
    }).then((res) => res.data),

  getById: (id: number) =>
    api.get(`../transfers/${id}`).then((res) => res.data),

  approve: (id: number) =>
    api.patch(`../transfers/${id}/approve`).then((res) => res.data),

  complete: (id: number) =>
    api.patch(`../transfers/${id}/complete`).then((res) => res.data),

  cancel: (id: number) =>
    api.patch(`../transfers/${id}/cancel`).then((res) => res.data),

  create: (data: any) =>
    api.post("../transfers", data).then((res) => res.data),

  delete: (id: number) =>
    api.delete(`../transfers/${id}`).then((res) => res.data),
};
