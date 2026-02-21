import api from "./client";
import type {
  RawMatch,
  Match,
  MatchListResponse,
  Scorecard,
  MatchTimeline,
} from "@/lib/types/match";
import { normalizeMatch, normalizeMatches } from "@/lib/utils/normalize-match";

export interface MatchFilters {
  status?: string;
  date?: string;
  team?: string;
  competition_id?: string;
  limit?: number;
  offset?: number;
}

export async function getMatches(
  filters: MatchFilters = {}
): Promise<{ matches: Match[]; total: number }> {
  const { data } = await api.get<MatchListResponse>("/matches", {
    params: filters,
  });
  return { matches: normalizeMatches(data.matches), total: data.total };
}

export async function getLiveMatches(): Promise<{
  matches: Match[];
  total: number;
}> {
  const { data } = await api.get<MatchListResponse>("/matches/live");
  return { matches: normalizeMatches(data.matches), total: data.total };
}

export async function getMatch(matchId: string): Promise<Match> {
  const { data } = await api.get<RawMatch>(`/matches/${matchId}`);
  return normalizeMatch(data);
}

export async function getScorecard(matchId: string) {
  const { data } = await api.get<Scorecard>(`/matches/${matchId}/scorecard`);
  return data;
}

export async function getTimeline(matchId: string, innings: number = 1) {
  const { data } = await api.get<MatchTimeline>(
    `/matches/${matchId}/timeline`,
    { params: { innings } }
  );
  return data;
}

export async function getAiPreview(matchId: string) {
  const { data } = await api.get<{
    match_id: string;
    content: string;
    generated_at: string;
  }>(`/matches/${matchId}/ai-preview`);
  return data;
}

export async function getAiReport(matchId: string) {
  const { data } = await api.get<{
    match_id: string;
    content: string;
    generated_at: string;
  }>(`/matches/${matchId}/ai-report`);
  return data;
}

export async function generateAiPreview(matchId: string) {
  const { data } = await api.post<{
    message: string;
    content_id: string;
  }>(`/admin/ai/generate-preview/${matchId}`);
  return data;
}

export async function generateAiReport(matchId: string) {
  const { data } = await api.post<{
    message: string;
    content_id: string;
  }>(`/admin/ai/generate-report/${matchId}`);
  return data;
}
