import api from "./client";
import type { LeaderboardResponse } from "@/lib/types/leaderboard";

interface LeaderboardParams {
  limit?: number;
  offset?: number;
}

export async function getMatchLeaderboard(
  matchId: string,
  params: LeaderboardParams = {}
): Promise<LeaderboardResponse> {
  const { data } = await api.get<LeaderboardResponse>(
    `/leaderboards/match/${matchId}`,
    { params }
  );
  return data;
}

export async function getDailyLeaderboard(
  date?: string,
  params: LeaderboardParams = {}
): Promise<LeaderboardResponse> {
  const { data } = await api.get<LeaderboardResponse>(
    "/leaderboards/daily",
    { params: { ...params, date } }
  );
  return data;
}

export async function getSeasonLeaderboard(
  params: LeaderboardParams = {}
): Promise<LeaderboardResponse> {
  const { data } = await api.get<LeaderboardResponse>(
    "/leaderboards/season",
    { params }
  );
  return data;
}

export async function getCompetitionLeaderboard(
  competitionId: string,
  params: LeaderboardParams = {}
): Promise<LeaderboardResponse> {
  const { data } = await api.get<LeaderboardResponse>(
    `/leaderboards/competition/${competitionId}`,
    { params }
  );
  return data;
}

export async function getLeagueLeaderboard(
  leagueId: string,
  params: LeaderboardParams = {}
): Promise<LeaderboardResponse> {
  const { data } = await api.get<LeaderboardResponse>(
    `/leaderboards/league/${leagueId}`,
    { params }
  );
  return data;
}
