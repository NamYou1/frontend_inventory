import api from "@/api/axios";
import type { RoleForm, IRole } from "@/types/Role.type";
import type { ApiFlatResponse } from "@/utils/Pagination";

export const RoleService = {
  getAll: (): Promise<ApiFlatResponse<IRole[]>> =>
    api.get("role").then((res) => res.data),

  getById: (id: number): Promise<ApiFlatResponse<IRole>> =>
    api.get(`role/${id}`).then((res) => res.data),

  create: (data: RoleForm): Promise<ApiFlatResponse<IRole>> =>
    api.post("role", data).then((res) => res.data),

  update: (id: number, data: RoleForm): Promise<ApiFlatResponse<IRole>> =>
    api.put(`role/${id}`, data).then((res) => res.data),

  delete: (id: number): Promise<ApiFlatResponse<null>> =>
    api.delete(`role/${id}`).then((res) => res.data),
};
