import api from "@/api/axios";
import type { AdjustmentFilter, IAdjustment } from "@/types/Adjustment.type";
import type { ApiResponse } from "@/utils/Pagination";

export const AdjustmentService = {
  getAll: (filter: AdjustmentFilter = {}): Promise<ApiResponse<IAdjustment[]>> =>
    api.get("adjustments", {
      params: {
        page: filter.page,
        size: filter.size,
        ...(filter.status && { status: filter.status }),
      },
    }).then((res) => res.data),

  getById: (id: number) =>
    api.get(`adjustments/${id}`).then((res) => res.data),

  updateStatus: (id: number, status: string) =>
    api.patch(`adjustments/${id}/status`, null, { params: { status } }).then((res) => res.data),

  create: (data: any) =>
    api.post("adjustments", data).then((res) => res.data),

  delete: (id: number) =>
    api.delete(`adjustments/${id}`).then((res) => res.data),
};
