import api from "./client";
import type {
  Prediction,
  PredictionSummary,
  PredictionStats,
  PredictionListResponse,
  PredictionHistoryResponse,
  CreateBallPredictionPayload,
  CreateOverPredictionPayload,
  CreateMilestonePredictionPayload,
  CreateMatchWinnerPayload,
} from "@/lib/types/prediction";

// ── Mutations ──

export async function createBallPrediction(
  payload: CreateBallPredictionPayload
): Promise<{ prediction: Prediction }> {
  const { data } = await api.post<{ prediction: Prediction }>(
    "/predictions/ball",
    payload
  );
  return data;
}

export async function createOverPrediction(
  payload: CreateOverPredictionPayload
): Promise<{ prediction: Prediction }> {
  const { data } = await api.post<{ prediction: Prediction }>(
    "/predictions/over",
    payload
  );
  return data;
}

export async function createMilestonePrediction(
  payload: CreateMilestonePredictionPayload
): Promise<{ prediction: Prediction }> {
  const { data } = await api.post<{ prediction: Prediction }>(
    "/predictions/milestone",
    payload
  );
  return data;
}

export async function createMatchWinnerPrediction(
  payload: CreateMatchWinnerPayload
): Promise<{ prediction: Prediction }> {
  const { data } = await api.post<{ prediction: Prediction }>(
    "/predictions/match-winner",
    payload
  );
  return data;
}

// ── Queries ──

export async function getMatchPredictions(
  matchId: string
): Promise<PredictionListResponse> {
  const { data } = await api.get<PredictionListResponse>(
    `/predictions/match/${matchId}`
  );
  return data;
}

export async function getMatchPredictionSummary(
  matchId: string
): Promise<PredictionSummary> {
  const { data } = await api.get<PredictionSummary>(
    `/predictions/match/${matchId}/summary`
  );
  return data;
}

export async function getPredictionHistory(
  page: number = 1,
  limit: number = 20
): Promise<PredictionHistoryResponse> {
  const { data } = await api.get<PredictionHistoryResponse>(
    "/predictions/history",
    { params: { page, limit } }
  );
  return data;
}

export async function getPredictionStats(): Promise<PredictionStats> {
  const { data } = await api.get<PredictionStats>("/predictions/stats");
  return data;
}

// ── AI Probabilities ──

export interface BallProbabilities {
  match_id: string;
  ball_key: string;
  probabilities: Record<string, number>;
  model_version: string;
}

export async function getBallProbabilities(
  matchId: string
): Promise<BallProbabilities> {
  const { data } = await api.get<BallProbabilities>(
    `/ai/match/${matchId}/probabilities`
  );
  return data;
}
