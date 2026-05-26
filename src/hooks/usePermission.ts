import { PermissionService } from "@/services/PermissionService";
import { useQuery } from "@tanstack/react-query";

export const permissionKeys = {
  all: ["permissions"] as const,
  lists: () => [...permissionKeys.all, "list"] as const,
  groups: () => [...permissionKeys.all, "groups"] as const,
};

export function usePermissions() {
  return useQuery({
    queryKey: permissionKeys.lists(),
    queryFn: () => PermissionService.getAll(),
  });
}

export function usePermissionGroups() {
  return useQuery({
    queryKey: permissionKeys.groups(),
    queryFn: () => PermissionService.getGroups(),
  });
}
