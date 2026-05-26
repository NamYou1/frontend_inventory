import api from "@/api/axios";
import type { SupplierFilter, SupplierForm, ISupplier } from "@/types/Supplier.type";
import type { ApiResponse } from "@/utils/Pagination";

export const SupplierService = {
  getAll: (filter: SupplierFilter = {}): Promise<ApiResponse<ISupplier[]>> =>
    api.get("suppliers", {
      params: {
        page: filter.page,
        size: filter.size,
        ...(filter.name && { name: filter.name }),
        ...(filter.status && { status: filter.status }),
      },
    }).then((res) => res.data),

  getById: (id: number) =>
    api.get(`suppliers/${id}`).then((res) => res.data),

  create: (data: SupplierForm) =>
    api.post("suppliers", data).then((res) => res.data),

  update: (id: number, data: SupplierForm) =>
    api.put(`suppliers/${id}`, data).then((res) => res.data),

  delete: (id: number) =>
    api.post(`suppliers/${id}`).then((res) => res.data),
};
