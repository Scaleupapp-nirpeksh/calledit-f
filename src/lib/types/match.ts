import type { MatchStatus } from "./constants";

/**
 * Normalized innings data used by all components.
 */
export interface Innings {
  innings_number: number;
  batting_team: string;
  bowling_team: string;
  score: number;
  wickets: number;
  overs: number;
  run_rate: number;
  target?: number | null;
  required_rate?: number | null;
}

/**
 * Raw score entry from the API (`score` field).
 */
export interface RawScoreEntry {
  r: number;
  w: number;
  o: number;
  inning: string; // e.g. "Oman Inning 1"
}

export interface BallLogEntry {
  ball_key: string;
  innings: number;
  over: number;
  ball: number;
  batter: string;
  bowler: string;
  non_striker: string;
  outcome: string;
  batter_runs: number;
  extras: number;
  total_runs: number;
  is_wicket: boolean;
  wicket_kind: string | null;
  player_out: string | null;
}

/**
 * Raw match shape from the API.
 */
export interface RawMatch {
  id: string;
  cricapi_id: string;
  name: string;
  match_type: string;
  status: MatchStatus;
  venue: string;
  date: string;
  team1: string;
  team2: string;
  team1_code: string;
  team2_code: string;
  team1_img?: string | null;
  team2_img?: string | null;
  toss_winner: string | null;
  toss_decision: string | null;
  innings: Innings[];
  score?: RawScoreEntry[];
  winner: string | null;
  result_text: string | null;
  competition_id: string | null;
  ai_preview: string | null;
  prediction_window_open: boolean;
  current_innings: number | null;
  current_over: number | null;
  current_ball: number | null;
  created_at: string;
  updated_at: string;
}

/**
 * Normalized match used by all components.
 * Always has `innings` populated (from raw `innings` or raw `score`).
 */
export interface Match {
  id: string;
  cricapi_id: string;
  name: string;
  match_type: string;
  status: MatchStatus;
  venue: string;
  date: string;
  team1: string;
  team2: string;
  team1_code: string;
  team2_code: string;
  team1_img?: string | null;
  team2_img?: string | null;
  toss_winner: string | null;
  toss_decision: string | null;
  innings: Innings[];
  winner: string | null;
  result_text: string | null;
  competition_id: string | null;
  ai_preview: string | null;
  prediction_window_open: boolean;
  current_innings: number | null;
  current_over: number | null;
  current_ball: number | null;
  created_at: string;
  updated_at: string;
}

export interface MatchListResponse {
  matches: RawMatch[];
  total: number;
}

// ── Scorecard types (actual API shape) ──

export interface ScorecardBatsman {
  batsman: { id: string; name: string; cricbuzz_id?: string };
  dismissal?: string;
  bowler?: { id: string; name: string };
  catcher?: { id: string; name: string };
  "dismissal-text": string;
  r: number;
  b: number;
  "4s": number;
  "6s": number;
  sr: number;
}

export interface ScorecardBowler {
  bowler: { id: string; name: string };
  o: number;
  m: number;
  r: number;
  w: number;
  nb: number;
  wd: number;
  eco: number;
}

export interface DetailedInningsScorecard {
  batting: ScorecardBatsman[];
  bowling: ScorecardBowler[];
  catching: unknown[];
  extras: Record<string, unknown>;
  totals: Record<string, unknown>;
  inning: string; // e.g. "Oman Inning 1"
}

export interface Scorecard {
  match_id: string;
  innings: Innings[];
  ball_log: BallLogEntry[];
  detailed_scorecard: DetailedInningsScorecard[];
  team1: string;
  team2: string;
  team1_code: string;
  team2_code: string;
  team1_img?: string | null;
  team2_img?: string | null;
  result_text: string | null;
  winner: string | null;
  toss_winner: string | null;
  toss_decision: string | null;
}

export interface MatchTimeline {
  match_id: string;
  innings: number;
  balls: BallLogEntry[];
}
