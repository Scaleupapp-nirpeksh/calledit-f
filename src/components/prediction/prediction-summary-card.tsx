"use client";

import { useMatchPredictionSummary } from "@/lib/queries/predictions";
import { StreakDisplay } from "./streak-display";
import { Loader2 } from "lucide-react";

interface PredictionSummaryCardProps {
  matchId: string;
}

export function PredictionSummaryCard({ matchId }: PredictionSummaryCardProps) {
  const { data: summary, isLoading } = useMatchPredictionSummary(matchId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!summary || summary.total_predictions === 0) return null;

  return (
    <StreakDisplay
      currentStreak={summary.current_streak}
      totalPoints={summary.total_points}
      boostsRemaining={summary.confidence_boosts_remaining}
      accuracy={summary.accuracy}
    />
  );
}
