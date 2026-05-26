import api from "@/api/axios";
import type { IPermission, IPermissionGroup } from "@/types/Permission.type";
import type { ApiFlatResponse } from "@/utils/Pagination";

export const PermissionService = {
  getAll: (): Promise<ApiFlatResponse<IPermission[]>> =>
    api.get("permission").then((res) => res.data),

  getGroups: (): Promise<ApiFlatResponse<IPermissionGroup[]>> =>
    api.get("permission-group").then((res) => res.data),
};
