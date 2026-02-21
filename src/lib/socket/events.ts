import type { RawMatch } from "@/lib/types/match";
import type { MatchStatus } from "@/lib/types/constants";

// ── Client → Server ──

export interface JoinMatchPayload {
  match_id: string;
}

export interface LeaveMatchPayload {
  match_id: string;
}

// ── Server → Client ──

export interface BallUpdatePayload {
  match_id: string;
  ball_key: string;
  innings: number;
  over: number;
  ball: number;
  batter: string;
  bowler: string;
  outcome: string;
  batter_runs: number;
  extras: number;
  total_runs: number;
  is_wicket: boolean;
  score: number;
  wickets: number;
  overs: number;
  run_rate: number;
}

export interface PredictionWindowPayload {
  match_id: string;
  is_open: boolean;
  ball_key: string;
  innings: number;
  over: number;
  ball: number;
  closes_at: string;
}

export interface ScoreUpdatePayload {
  match_id: string;
  innings: number;
  score: number;
  wickets: number;
  overs: number;
  run_rate: number;
  batting_team: string;
}

export interface LeaderboardUpdatePayload {
  match_id: string;
  entries: {
    rank: number;
    user_id: string;
    username: string;
    total_points: number;
  }[];
}

export interface NotificationPayload {
  type:
    | "prediction_result"
    | "streak"
    | "badge"
    | "league"
    | "match_start"
    | "match_end"
    | "leaderboard";
  title: string;
  body: string;
  data: Record<string, unknown>;
}

export interface MatchStatusPayload {
  match_id: string;
  status: MatchStatus;
  previous_status: MatchStatus;
}

export interface AiCommentaryPayload {
  match_id: string;
  ball_key: string;
  commentary: string;
}

export interface OverSummaryPayload {
  match_id: string;
  innings: number;
  over: number;
  summary: string;
}

// ── Event map ──

export interface ServerToClientEvents {
  match_state: (data: RawMatch) => void;
  ball_update: (data: BallUpdatePayload) => void;
  prediction_window: (data: PredictionWindowPayload) => void;
  score_update: (data: ScoreUpdatePayload) => void;
  leaderboard_update: (data: LeaderboardUpdatePayload) => void;
  notification: (data: NotificationPayload) => void;
  match_status: (data: MatchStatusPayload) => void;
  ai_commentary: (data: AiCommentaryPayload) => void;
  over_summary: (data: OverSummaryPayload) => void;
}

export interface ClientToServerEvents {
  join_match: (data: JoinMatchPayload) => void;
  leave_match: (data: LeaveMatchPayload) => void;
}
