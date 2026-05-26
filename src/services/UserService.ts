import api from "@/api/axios";
import type { UserFilter, UserForm, IUser } from "@/types/User.type";
import type { ApiResponse } from "@/utils/Pagination";

export const UserService = {
  getAll: (filter: UserFilter = {}): Promise<ApiResponse<IUser[]>> =>
    api.get("users", {
        params: {
          page: filter.page,
          size: filter.size,
          ...(filter.username && { username: filter.username }),
          ...(filter.email && { email: filter.email }),
        },
      })
      .then((res) => res.data),

  getById: (id: number): Promise<ApiResponse<IUser>> =>
    api.get(`users/${id}`).then((res) => res.data),

  create: (data: UserForm): Promise<ApiResponse<IUser>> =>
    api.post("users", data).then((res) => res.data),

  update: (id: number, data: UserForm): Promise<ApiResponse<IUser>> =>
    api.put(`users/${id}`, data).then((res) => res.data),

  delete: (id: number): Promise<ApiResponse<null>> =>
    api.delete(`users/${id}`).then((res) => res.data),
};
