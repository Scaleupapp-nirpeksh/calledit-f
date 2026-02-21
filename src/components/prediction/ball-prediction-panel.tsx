"use client";

import { useCallback } from "react";
import { BALL_OUTCOMES, type BallOutcome } from "@/lib/types/constants";
import { useMatchStore } from "@/lib/stores/match-store";
import { usePredictionStore } from "@/lib/stores/prediction-store";
import { usePredictionCountdown } from "@/lib/socket/hooks";
import { useCreateBallPrediction } from "@/lib/queries/predictions";
import { CountdownRing } from "./countdown-ring";
import { ConfidenceBoostToggle } from "./confidence-boost-toggle";
import { cn } from "@/lib/utils";
import { haptic } from "@/lib/utils/haptic";
import { Loader2, Check, Zap } from "lucide-react";
import { toast } from "sonner";

interface BallPredictionPanelProps {
  matchId: string;
}

const OUTCOME_CONFIG: Record<
  BallOutcome,
  { label: string; color: string; activeColor: string }
> = {
  dot: {
    label: "0",
    color: "border-muted-foreground/30 text-muted-foreground",
    activeColor: "border-muted-foreground bg-muted-foreground/20 text-foreground",
  },
  "1": {
    label: "1",
    color: "border-blue-500/30 text-blue-400",
    activeColor: "border-blue-500 bg-blue-500/20 text-blue-300",
  },
  "2": {
    label: "2",
    color: "border-cyan-500/30 text-cyan-400",
    activeColor: "border-cyan-500 bg-cyan-500/20 text-cyan-300",
  },
  "3": {
    label: "3",
    color: "border-yellow-500/30 text-yellow-400",
    activeColor: "border-yellow-500 bg-yellow-500/20 text-yellow-300",
  },
  "4": {
    label: "4",
    color: "border-secondary/30 text-secondary",
    activeColor: "border-secondary bg-secondary/20 text-secondary",
  },
  "6": {
    label: "6",
    color: "border-primary/30 text-primary",
    activeColor: "border-primary bg-primary/20 text-primary",
  },
  wicket: {
    label: "W",
    color: "border-destructive/30 text-destructive",
    activeColor: "border-destructive bg-destructive/20 text-destructive",
  },
};

export function BallPredictionPanel({ matchId }: BallPredictionPanelProps) {
  const predictionWindow = useMatchStore((s) => s.predictionWindow);
  const secondsLeft = usePredictionCountdown();
  const mutation = useCreateBallPrediction(matchId);

  const {
    state,
    selectedOutcome,
    confidenceBoost,
    selectOutcome,
    markSubmitted,
  } = usePredictionStore();

  const isWindowOpen = predictionWindow?.isOpen && secondsLeft > 0;
  const isSubmitted = state === "submitted" && predictionWindow?.ballKey === usePredictionStore.getState().submittedBallKey;

  const handleSelect = useCallback(
    (outcome: BallOutcome) => {
      if (!isWindowOpen || isSubmitted || mutation.isPending) return;
      haptic("light");
      selectOutcome(outcome);
    },
    [isWindowOpen, isSubmitted, mutation.isPending, selectOutcome]
  );

  const handleSubmit = useCallback(() => {
    if (!predictionWindow || !selectedOutcome || mutation.isPending) return;

    mutation.mutate(
      {
        match_id: matchId,
        innings: predictionWindow.innings,
        over: predictionWindow.over,
        ball: predictionWindow.ball,
        prediction: selectedOutcome,
        confidence_boost: confidenceBoost,
      },
      {
        onSuccess: () => {
          haptic("success");
          markSubmitted(predictionWindow.ballKey);
          toast.success("Prediction submitted!");
        },
        onError: (err) => {
          const message =
            (err as { response?: { data?: { detail?: string } } }).response
              ?.data?.detail ?? "Failed to submit prediction";
          toast.error(message);
        },
      }
    );
  }, [
    predictionWindow,
    selectedOutcome,
    confidenceBoost,
    matchId,
    mutation,
    markSubmitted,
  ]);

  if (!isWindowOpen && !isSubmitted) return null;

  return (
    <div className="rounded-xl border border-primary/20 bg-card p-4 shadow-[0_0_20px_rgba(var(--primary),0.08)]">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">Predict Next Ball</span>
          {predictionWindow && (
            <span className="text-xs text-muted-foreground tabular-nums">
              Over {predictionWindow.over}.{predictionWindow.ball}
            </span>
          )}
        </div>
        {isWindowOpen && !isSubmitted && (
          <CountdownRing secondsLeft={secondsLeft} />
        )}
        {isSubmitted && (
          <div className="flex items-center gap-1 text-xs font-medium text-primary">
            <Check className="h-3.5 w-3.5" />
            Submitted
          </div>
        )}
      </div>

      {/* Outcome buttons */}
      <div className="grid grid-cols-7 gap-2">
        {BALL_OUTCOMES.map((outcome) => {
          const config = OUTCOME_CONFIG[outcome];
          const isSelected = selectedOutcome === outcome;
          const disabled = !isWindowOpen || isSubmitted || mutation.isPending;

          return (
            <button
              key={outcome}
              onClick={() => handleSelect(outcome)}
              disabled={disabled}
              className={cn(
                "flex h-12 items-center justify-center rounded-lg border-2 text-sm font-bold transition-all",
                disabled && !isSelected && "opacity-40 cursor-not-allowed",
                isSelected ? config.activeColor : config.color,
                !disabled &&
                  !isSelected &&
                  "hover:opacity-80 active:scale-95 cursor-pointer"
              )}
            >
              {config.label}
            </button>
          );
        })}
      </div>

      {/* Confidence boost + submit */}
      {isWindowOpen && !isSubmitted && (
        <div className="mt-3 flex items-center justify-between">
          <ConfidenceBoostToggle />
          <button
            onClick={handleSubmit}
            disabled={!selectedOutcome || mutation.isPending}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all",
              selectedOutcome
                ? "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 cursor-pointer"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            {mutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Submit"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
