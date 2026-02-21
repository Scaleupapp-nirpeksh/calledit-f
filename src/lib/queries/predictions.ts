import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./keys";
import {
  createBallPrediction,
  createOverPrediction,
  createMilestonePrediction,
  createMatchWinnerPrediction,
  getMatchPredictions,
  getMatchPredictionSummary,
  getPredictionHistory,
  getPredictionStats,
  getBallProbabilities,
} from "@/lib/api/predictions";
import type {
  CreateBallPredictionPayload,
  CreateOverPredictionPayload,
  CreateMilestonePredictionPayload,
  CreateMatchWinnerPayload,
} from "@/lib/types/prediction";

// ── Queries ──

export function useMatchPredictions(matchId: string) {
  return useQuery({
    queryKey: queryKeys.predictions.match(matchId),
    queryFn: () => getMatchPredictions(matchId),
    enabled: !!matchId,
  });
}

export function useMatchPredictionSummary(matchId: string) {
  return useQuery({
    queryKey: queryKeys.predictions.summary(matchId),
    queryFn: () => getMatchPredictionSummary(matchId),
    enabled: !!matchId,
    refetchInterval: 30_000,
  });
}

export function usePredictionHistory(page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: queryKeys.predictions.history(page),
    queryFn: () => getPredictionHistory(page, limit),
  });
}

export function usePredictionStats() {
  return useQuery({
    queryKey: queryKeys.predictions.stats(),
    queryFn: getPredictionStats,
  });
}

export function useBallProbabilities(matchId: string, enabled: boolean) {
  return useQuery({
    queryKey: [...queryKeys.predictions.all, "probabilities", matchId],
    queryFn: () => getBallProbabilities(matchId),
    enabled: !!matchId && enabled,
    refetchInterval: 15_000,
    retry: false,
  });
}

// ── Mutations ──

function useInvalidateOnSuccess(matchId: string) {
  const queryClient = useQueryClient();
  return {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.predictions.match(matchId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.predictions.summary(matchId),
      });
    },
  };
}

export function useCreateBallPrediction(matchId: string) {
  const callbacks = useInvalidateOnSuccess(matchId);
  return useMutation({
    mutationFn: (payload: CreateBallPredictionPayload) =>
      createBallPrediction(payload),
    ...callbacks,
  });
}

export function useCreateOverPrediction(matchId: string) {
  const callbacks = useInvalidateOnSuccess(matchId);
  return useMutation({
    mutationFn: (payload: CreateOverPredictionPayload) =>
      createOverPrediction(payload),
    ...callbacks,
  });
}

export function useCreateMilestonePrediction(matchId: string) {
  const callbacks = useInvalidateOnSuccess(matchId);
  return useMutation({
    mutationFn: (payload: CreateMilestonePredictionPayload) =>
      createMilestonePrediction(payload),
    ...callbacks,
  });
}

export function useCreateMatchWinnerPrediction(matchId: string) {
  const callbacks = useInvalidateOnSuccess(matchId);
  return useMutation({
    mutationFn: (payload: CreateMatchWinnerPayload) =>
      createMatchWinnerPrediction(payload),
    ...callbacks,
  });
}
