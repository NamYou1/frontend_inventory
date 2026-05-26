import { UserService } from "@/services/UserService";
import type { UserFilter, UserForm } from "@/types/User.type";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";

export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filter: UserFilter) => [...userKeys.lists(), filter] as const,
  detail: (id: number) => [...userKeys.all, "detail", id] as const,
};

export function useUsers(filter: UserFilter = {}) {
  return useQuery({
    queryKey: userKeys.list(filter),
    queryFn: () => UserService.getAll(filter),
    placeholderData: keepPreviousData,
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: UserService.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.lists() }),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UserForm }) =>
      UserService.update(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: userKeys.lists() });
      qc.invalidateQueries({ queryKey: userKeys.detail(id) });
    },
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: UserService.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.lists() }),
  });
}
