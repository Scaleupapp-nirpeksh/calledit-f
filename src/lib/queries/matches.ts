import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./keys";
import {
  getMatches,
  getLiveMatches,
  getMatch,
  getScorecard,
  getTimeline,
  getAiPreview,
  getAiReport,
  generateAiPreview,
  generateAiReport,
  type MatchFilters,
} from "@/lib/api/matches";

export function useMatches(filters: MatchFilters = {}) {
  return useQuery({
    queryKey: queryKeys.matches.list(filters),
    queryFn: () => getMatches(filters),
  });
}

export function useLiveMatches() {
  return useQuery({
    queryKey: queryKeys.matches.live(),
    queryFn: getLiveMatches,
    refetchInterval: 30_000,
  });
}

export function useMatch(matchId: string) {
  return useQuery({
    queryKey: queryKeys.matches.detail(matchId),
    queryFn: () => getMatch(matchId),
    enabled: !!matchId,
  });
}

export function useScorecard(matchId: string) {
  return useQuery({
    queryKey: queryKeys.matches.scorecard(matchId),
    queryFn: () => getScorecard(matchId),
    enabled: !!matchId,
  });
}

export function useTimeline(matchId: string, innings: number = 1) {
  return useQuery({
    queryKey: queryKeys.matches.timeline(matchId, innings),
    queryFn: () => getTimeline(matchId, innings),
    enabled: !!matchId,
  });
}

export function useAiPreview(matchId: string) {
  return useQuery({
    queryKey: queryKeys.matches.aiPreview(matchId),
    queryFn: () => getAiPreview(matchId),
    enabled: !!matchId,
    retry: false,
  });
}

export function useAiReport(matchId: string) {
  return useQuery({
    queryKey: queryKeys.matches.aiReport(matchId),
    queryFn: () => getAiReport(matchId),
    enabled: !!matchId,
    retry: false,
  });
}

export function useGenerateAiPreview(matchId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => generateAiPreview(matchId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.matches.aiPreview(matchId),
      });
    },
  });
}

export function useGenerateAiReport(matchId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => generateAiReport(matchId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.matches.aiReport(matchId),
      });
    },
  });
}
