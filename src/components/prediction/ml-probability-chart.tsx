"use client";

import { useBallProbabilities } from "@/lib/queries/predictions";
import { BALL_OUTCOMES, type BallOutcome } from "@/lib/types/constants";
import { cn } from "@/lib/utils";
import { Brain, Loader2 } from "lucide-react";

interface MlProbabilityChartProps {
  matchId: string;
  isLive: boolean;
}

const OUTCOME_COLORS: Record<BallOutcome, string> = {
  dot: "bg-muted-foreground",
  "1": "bg-blue-500",
  "2": "bg-cyan-500",
  "3": "bg-yellow-500",
  "4": "bg-secondary",
  "6": "bg-primary",
  wicket: "bg-destructive",
};

const OUTCOME_LABELS: Record<BallOutcome, string> = {
  dot: "Dot",
  "1": "1",
  "2": "2",
  "3": "3",
  "4": "Four",
  "6": "Six",
  wicket: "Wicket",
};

export function MlProbabilityChart({
  matchId,
  isLive,
}: MlProbabilityChartProps) {
  const { data, isLoading } = useBallProbabilities(matchId, isLive);

  if (!isLive) return null;

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading AI predictions...
        </div>
      </div>
    );
  }

  if (!data?.probabilities) return null;

  const probs = data.probabilities;
  const maxProb = Math.max(...Object.values(probs), 0.01);

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center gap-2">
        <Brain className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold">AI Probabilities</span>
        <span className="text-xs text-muted-foreground">
          {data.model_version}
        </span>
      </div>

      <div className="space-y-2">
        {BALL_OUTCOMES.map((outcome) => {
          const prob = probs[outcome] ?? 0;
          const pct = Math.round(prob * 100);
          const barWidth = (prob / maxProb) * 100;

          return (
            <div key={outcome} className="flex items-center gap-3">
              <span className="w-10 text-right text-xs font-medium text-muted-foreground">
                {OUTCOME_LABELS[outcome]}
              </span>
              <div className="flex-1">
                <div className="h-5 w-full rounded-full bg-muted/50 overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      OUTCOME_COLORS[outcome]
                    )}
                    style={{ width: `${barWidth}%`, opacity: 0.7 + prob * 0.3 }}
                  />
                </div>
              </div>
              <span className="w-10 text-right text-xs font-bold tabular-nums">
                {pct}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
