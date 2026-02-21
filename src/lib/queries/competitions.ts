import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./keys";
import {
  getCompetitions,
  getCompetition,
  getCompetitionMatches,
  type CompetitionFilters,
} from "@/lib/api/competitions";

export function useCompetitions(filters: CompetitionFilters = {}) {
  return useQuery({
    queryKey: queryKeys.competitions.list(filters),
    queryFn: () => getCompetitions(filters),
  });
}

export function useCompetition(competitionId: string) {
  return useQuery({
    queryKey: queryKeys.competitions.detail(competitionId),
    queryFn: () => getCompetition(competitionId),
    enabled: !!competitionId,
  });
}

export function useCompetitionMatches(competitionId: string) {
  return useQuery({
    queryKey: queryKeys.competitions.matches(competitionId),
    queryFn: () => getCompetitionMatches(competitionId),
    enabled: !!competitionId,
  });
}
