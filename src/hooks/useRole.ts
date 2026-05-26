import { RoleService } from "@/services/RoleService";
import type { RoleForm } from "@/types/Role.type";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const roleKeys = {
  all: ["roles"] as const,
  lists: () => [...roleKeys.all, "list"] as const,
  detail: (id: number) => [...roleKeys.all, "detail", id] as const,
};

export function useRoles() {
  return useQuery({
    queryKey: roleKeys.lists(),
    queryFn: () => RoleService.getAll(),
  });
}

export function useCreateRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: RoleService.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: roleKeys.lists() }),
  });
}

export function useUpdateRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: RoleForm }) =>
      RoleService.update(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: roleKeys.lists() });
      qc.invalidateQueries({ queryKey: roleKeys.detail(id) });
    },
  });
}

export function useDeleteRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: RoleService.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: roleKeys.lists() }),
  });
}
