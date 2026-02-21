import api from "./client";
import type {
  Competition,
  CompetitionListResponse,
  RawCompetitionMatchesResponse,
  CompetitionMatchesResponse,
} from "@/lib/types/competition";
import { normalizeMatches } from "@/lib/utils/normalize-match";

export interface CompetitionFilters {
  is_active?: boolean;
  season?: string;
}

export async function getCompetitions(filters: CompetitionFilters = {}) {
  const { data } = await api.get<CompetitionListResponse>("/competitions", {
    params: filters,
  });
  return data;
}

export async function getCompetition(competitionId: string) {
  const { data } = await api.get<Competition>(
    `/competitions/${competitionId}`
  );
  return data;
}

export async function getCompetitionMatches(
  competitionId: string
): Promise<CompetitionMatchesResponse> {
  const { data } = await api.get<RawCompetitionMatchesResponse>(
    `/competitions/${competitionId}/matches`
  );
  return {
    competition: data.competition,
    matches: normalizeMatches(data.matches),
    total: data.total,
  };
}
