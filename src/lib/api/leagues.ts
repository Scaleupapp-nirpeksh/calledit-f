import api from "./client";
import type {
  League,
  LeagueListResponse,
  CreateLeaguePayload,
  JoinLeaguePayload,
} from "@/lib/types/league";

/** Normalize _id → id if backend uses MongoDB-style IDs */
function normalizeLeague(raw: Record<string, unknown>): League {
  return { ...raw, id: (raw.id ?? raw._id) as string } as League;
}

export async function getMyLeagues(): Promise<LeagueListResponse> {
  const { data } = await api.get<LeagueListResponse>("/leagues");
  const leagues = (data.leagues ?? []).map((l) =>
    normalizeLeague(l as unknown as Record<string, unknown>)
  );
  return { leagues, total: data.total ?? leagues.length };
}

export async function getLeague(leagueId: string): Promise<{ league: League }> {
  const { data } = await api.get<{ league: League }>(`/leagues/${leagueId}`);
  return {
    league: normalizeLeague(data.league as unknown as Record<string, unknown>),
  };
}

export async function createLeague(
  payload: CreateLeaguePayload
): Promise<{ league: League }> {
  const { data } = await api.post<{ league: League }>("/leagues", payload);
  return data;
}

export async function joinLeague(
  payload: JoinLeaguePayload
): Promise<{ league: League; message: string }> {
  const { data } = await api.post<{ league: League; message: string }>(
    "/leagues/join",
    payload
  );
  return data;
}

export async function leaveLeague(
  leagueId: string
): Promise<{ message: string }> {
  const { data } = await api.delete<{ message: string }>(
    `/leagues/${leagueId}/leave`
  );
  return data;
}
