"use client";

import type { BallLogEntry } from "@/lib/types/match";
import { OverRow } from "./over-row";

interface InningsScorecardProps {
  balls: BallLogEntry[];
  inningsNumber: number;
}

/**
 * Groups ball log entries by over and renders each over row.
 */
export function InningsScorecard({
  balls,
  inningsNumber,
}: InningsScorecardProps) {
  const inningsBalls = balls.filter((b) => b.innings === inningsNumber);

  // Group by over number
  const overs = new Map<number, BallLogEntry[]>();
  for (const ball of inningsBalls) {
    const existing = overs.get(ball.over) ?? [];
    existing.push(ball);
    overs.set(ball.over, existing);
  }

  const sortedOvers = Array.from(overs.entries()).sort(
    ([a], [b]) => a - b
  );

  if (sortedOvers.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-muted-foreground">
        No ball data available
      </p>
    );
  }

  return (
    <div className="divide-y divide-border">
      {sortedOvers.map(([overNum, overBalls]) => (
        <OverRow
          key={overNum}
          overNumber={overNum}
          balls={overBalls}
          bowler={overBalls[0]?.bowler}
        />
      ))}
    </div>
  );
}
