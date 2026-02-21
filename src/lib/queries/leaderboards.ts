import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./keys";
import {
  getMatchLeaderboard,
  getDailyLeaderboard,
  getSeasonLeaderboard,
  getCompetitionLeaderboard,
  getLeagueLeaderboard,
} from "@/lib/api/leaderboards";

export function useMatchLeaderboard(matchId: string) {
  return useQuery({
    queryKey: queryKeys.leaderboards.match(matchId),
    queryFn: () => getMatchLeaderboard(matchId),
    enabled: !!matchId,
    refetchInterval: 30_000,
  });
}

export function useDailyLeaderboard(date?: string) {
  return useQuery({
    queryKey: queryKeys.leaderboards.daily(date),
    queryFn: () => getDailyLeaderboard(date),
  });
}

export function useSeasonLeaderboard() {
  return useQuery({
    queryKey: queryKeys.leaderboards.season(),
    queryFn: () => getSeasonLeaderboard(),
  });
}

export function useCompetitionLeaderboard(competitionId: string) {
  return useQuery({
    queryKey: queryKeys.leaderboards.competition(competitionId),
    queryFn: () => getCompetitionLeaderboard(competitionId),
    enabled: !!competitionId,
  });
}

export function useLeagueLeaderboard(leagueId: string) {
  return useQuery({
    queryKey: [...queryKeys.leagues.leaderboard(leagueId)],
    queryFn: () => getLeagueLeaderboard(leagueId),
    enabled: !!leagueId,
  });
}
