import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./keys";
import { getMe, updateMe, getUserById } from "@/lib/api/users";
import type { UpdateProfilePayload } from "@/lib/types/user";

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.users.me(),
    queryFn: getMe,
  });
}

export function useUser(userId: string) {
  return useQuery({
    queryKey: queryKeys.users.detail(userId),
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateMe(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.me() });
    },
  });
}
