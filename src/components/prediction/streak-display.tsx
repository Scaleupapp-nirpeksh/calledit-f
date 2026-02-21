"use client";

import { cn } from "@/lib/utils";
import { Flame, Target, Zap } from "lucide-react";

interface StreakDisplayProps {
  currentStreak: number;
  totalPoints: number;
  boostsRemaining: number;
  accuracy?: number;
  className?: string;
}

export function StreakDisplay({
  currentStreak,
  totalPoints,
  boostsRemaining,
  accuracy,
  className,
}: StreakDisplayProps) {
  const streakMultiplier =
    currentStreak >= 10
      ? "3.0x"
      : currentStreak >= 5
        ? "2.0x"
        : currentStreak >= 3
          ? "1.5x"
          : "1.0x";

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-xl border border-border bg-card px-4 py-3",
        className
      )}
    >
      {/* Streak */}
      <div className="flex items-center gap-1.5">
        <Flame
          className={cn(
            "h-4 w-4",
            currentStreak >= 5
              ? "text-orange-400"
              : currentStreak >= 3
                ? "text-yellow-500"
                : "text-muted-foreground"
          )}
        />
        <div>
          <span className="text-sm font-bold tabular-nums">
            {currentStreak}
          </span>
          <span className="ml-1 text-xs text-muted-foreground">
            streak ({streakMultiplier})
          </span>
        </div>
      </div>

      <div className="h-4 w-px bg-border" />

      {/* Points */}
      <div className="flex items-center gap-1.5">
        <Zap className="h-4 w-4 text-primary" />
        <span className="text-sm font-bold tabular-nums">{totalPoints}</span>
        <span className="text-xs text-muted-foreground">pts</span>
      </div>

      {/* Accuracy (if available) */}
      {accuracy !== undefined && (
        <>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-1.5">
            <Target className="h-4 w-4 text-secondary" />
            <span className="text-sm font-bold tabular-nums">
              {accuracy.toFixed(0)}%
            </span>
          </div>
        </>
      )}

      {/* Boosts */}
      <div className="ml-auto flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <Flame
            key={i}
            className={cn(
              "h-3.5 w-3.5",
              i < boostsRemaining ? "text-orange-400" : "text-muted/30"
            )}
          />
        ))}
      </div>
    </div>
  );
}
