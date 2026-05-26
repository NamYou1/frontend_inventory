import api from "@/api/axios";
import type { UnitFilter, UnitForm, IUnit } from "@/types/Unit.type";
import type { ApiResponse } from "@/utils/Pagination";

export const UnitService = {
  getAll: (filter: UnitFilter = {}): Promise<ApiResponse<IUnit[]>> =>
    api.get("unit", {
      params: {
        page: filter.page,
        size: filter.size,
        ...(filter.name && { name: filter.name }),
        ...(filter.status && { status: filter.status }),
      },
    }).then((res) => res.data),

  getById: (id: number) =>
    api.get(`unit/${id}`).then((res) => res.data),

  create: (data: UnitForm) =>
    api.post("unit", data).then((res) => res.data),

  update: (id: number, data: UnitForm) =>
    api.put(`unit/${id}`, data).then((res) => res.data),

  delete: (id: number) =>
    api.post(`unit/${id}`).then((res) => res.data),
};
