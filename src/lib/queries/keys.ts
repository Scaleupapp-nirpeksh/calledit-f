import type { MatchFilters } from "@/lib/api/matches";
import type { CompetitionFilters } from "@/lib/api/competitions";

export const queryKeys = {
  matches: {
    all: ["matches"] as const,
    list: (filters?: MatchFilters) => ["matches", "list", filters] as const,
    live: () => ["matches", "live"] as const,
    detail: (matchId: string) => ["matches", "detail", matchId] as const,
    scorecard: (matchId: string) =>
      ["matches", "scorecard", matchId] as const,
    timeline: (matchId: string, innings: number) =>
      ["matches", "timeline", matchId, innings] as const,
    aiPreview: (matchId: string) =>
      ["matches", "ai-preview", matchId] as const,
    aiReport: (matchId: string) =>
      ["matches", "ai-report", matchId] as const,
  },

  competitions: {
    all: ["competitions"] as const,
    list: (filters?: CompetitionFilters) =>
      ["competitions", "list", filters] as const,
    detail: (competitionId: string) =>
      ["competitions", "detail", competitionId] as const,
    matches: (competitionId: string) =>
      ["competitions", "matches", competitionId] as const,
  },

  users: {
    me: () => ["users", "me"] as const,
    detail: (userId: string) => ["users", "detail", userId] as const,
  },

  predictions: {
    all: ["predictions"] as const,
    match: (matchId: string) => ["predictions", "match", matchId] as const,
    summary: (matchId: string) =>
      ["predictions", "summary", matchId] as const,
    history: (page: number) => ["predictions", "history", page] as const,
    stats: () => ["predictions", "stats"] as const,
  },

  leaderboards: {
    all: ["leaderboards"] as const,
    match: (matchId: string) => ["leaderboards", "match", matchId] as const,
    daily: (date?: string) => ["leaderboards", "daily", date] as const,
    season: () => ["leaderboards", "season"] as const,
    competition: (competitionId: string) =>
      ["leaderboards", "competition", competitionId] as const,
  },

  leagues: {
    all: ["leagues"] as const,
    my: () => ["leagues", "my"] as const,
    detail: (leagueId: string) => ["leagues", "detail", leagueId] as const,
    leaderboard: (leagueId: string) =>
      ["leagues", "leaderboard", leagueId] as const,
  },
};
