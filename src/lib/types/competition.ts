import type { Match, RawMatch } from "./match";

export interface Competition {
  id: string;
  name: string;
  short_name: string;
  match_type: string;
  season: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  is_platform_seeded: boolean;
  teams: string[];
  match_count: number;
  created_at: string;
  updated_at: string;
}

export interface CompetitionListResponse {
  competitions: Competition[];
  total: number;
}

export interface RawCompetitionMatchesResponse {
  competition: Competition;
  matches: RawMatch[];
  total: number;
}

export interface CompetitionMatchesResponse {
  competition: Competition;
  matches: Match[];
  total: number;
}
