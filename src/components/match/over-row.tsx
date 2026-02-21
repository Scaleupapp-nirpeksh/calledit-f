"use client";

import { BallChip } from "./ball-chip";
import type { BallLogEntry } from "@/lib/types/match";

interface OverRowProps {
  overNumber: number;
  balls: BallLogEntry[];
  bowler?: string;
}

export function OverRow({ overNumber, balls, bowler }: OverRowProps) {
  const overRuns = balls.reduce((sum, b) => sum + b.total_runs, 0);
  const wickets = balls.filter((b) => b.is_wicket).length;

  return (
    <div className="flex items-center gap-3 py-2">
      <div className="w-12 shrink-0 text-right">
        <span className="text-xs font-medium text-muted-foreground">
          Ov {overNumber}
        </span>
      </div>

      <div className="flex flex-1 items-center gap-1.5">
        {balls.map((ball) => (
          <BallChip key={ball.ball_key} outcome={ball.outcome} />
        ))}
      </div>

      <div className="shrink-0 text-right">
        <span className="text-sm font-bold">
          {overRuns}
          {wickets > 0 && (
            <span className="text-destructive">/{wickets}w</span>
          )}
        </span>
      </div>

      {bowler && (
        <div className="hidden w-24 shrink-0 truncate text-right text-xs text-muted-foreground sm:block">
          {bowler}
        </div>
      )}
    </div>
  );
}
