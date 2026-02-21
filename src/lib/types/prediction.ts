import type { PredictionType, MilestoneType } from "./constants";

export interface Prediction {
  id: string;
  user_id: string;
  match_id: string;
  type: PredictionType;
  innings: number;
  over?: number;
  ball?: number;
  ball_key?: string;
  prediction: string;
  confidence_boost?: boolean;
  is_resolved: boolean;
  is_correct: boolean | null;
  actual_outcome: string | null;
  base_points: number;
  streak_multiplier: number;
  confidence_multiplier: number;
  clutch_multiplier: number;
  total_points: number;
  created_at: string;
  resolved_at: string | null;
}

export interface PredictionSummary {
  match_id: string;
  user_id: string;
  total_predictions: number;
  correct_predictions: number;
  accuracy: number;
  total_points: number;
  current_streak: number;
  best_streak: number;
  confidence_boosts_used: number;
  confidence_boosts_remaining: number;
  predictions: Prediction[];
}

export interface PredictionTypeStats {
  total: number;
  correct: number;
  accuracy: number;
  points: number;
}

export interface PredictionStats {
  total_predictions: number;
  correct_predictions: number;
  accuracy: number;
  total_points: number;
  best_streak: number;
  matches_played: number;
  by_type: {
    ball: PredictionTypeStats;
    over: PredictionTypeStats;
    milestone: PredictionTypeStats;
    match_winner: PredictionTypeStats;
  };
}

// ── Request payloads ──

export interface CreateBallPredictionPayload {
  match_id: string;
  innings: number;
  over: number;
  ball: number;
  prediction: string;
  confidence_boost?: boolean;
}

export interface CreateOverPredictionPayload {
  match_id: string;
  innings: number;
  over: number;
  predicted_runs: number;
}

export interface CreateMilestonePredictionPayload {
  match_id: string;
  milestone_type: MilestoneType;
  player_name: string;
  will_achieve: boolean;
}

export interface CreateMatchWinnerPayload {
  match_id: string;
  predicted_winner: string;
}

// ── Response wrappers ──

export interface PredictionListResponse {
  predictions: Prediction[];
  total: number;
}

export interface PredictionHistoryResponse {
  predictions: Prediction[];
  total: number;
  page: number;
  limit: number;
}
