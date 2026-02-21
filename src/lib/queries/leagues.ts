import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./keys";
import {
  getMyLeagues,
  getLeague,
  createLeague,
  joinLeague,
  leaveLeague,
} from "@/lib/api/leagues";
import type { CreateLeaguePayload, JoinLeaguePayload } from "@/lib/types/league";

export function useMyLeagues() {
  return useQuery({
    queryKey: queryKeys.leagues.my(),
    queryFn: getMyLeagues,
  });
}

export function useLeague(leagueId: string) {
  return useQuery({
    queryKey: queryKeys.leagues.detail(leagueId),
    queryFn: () => getLeague(leagueId),
    enabled: !!leagueId,
  });
}

export function useCreateLeague() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateLeaguePayload) => createLeague(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leagues.all });
    },
  });
}

export function useJoinLeague() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: JoinLeaguePayload) => joinLeague(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leagues.all });
    },
  });
}

export function useLeaveLeague(leagueId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => leaveLeague(leagueId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leagues.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.leagues.detail(leagueId),
      });
    },
  });
}
