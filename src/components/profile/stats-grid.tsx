"use client";

import type { UserStats } from "@/lib/types/user";
import { cn } from "@/lib/utils";
import { Target, Zap, Flame, Trophy, Crosshair, Hash } from "lucide-react";

interface StatsGridProps {
  stats: UserStats;
  className?: string;
}

export function StatsGrid({ stats, className }: StatsGridProps) {
  const items = [
    {
      label: "Total Points",
      value: stats.total_points.toLocaleString(),
      icon: Zap,
      color: "text-primary",
    },
    {
      label: "Accuracy",
      value: `${stats.accuracy.toFixed(1)}%`,
      icon: Target,
      color: "text-secondary",
    },
    {
      label: "Best Streak",
      value: stats.best_streak.toString(),
      icon: Flame,
      color: "text-orange-400",
    },
    {
      label: "Predictions",
      value: `${stats.correct_predictions}/${stats.total_predictions}`,
      icon: Hash,
      color: "text-muted-foreground",
    },
    {
      label: "Matches",
      value: stats.matches_played.toString(),
      icon: Trophy,
      color: "text-yellow-500",
    },
    {
      label: "Clutch",
      value: stats.clutch_correct.toString(),
      icon: Crosshair,
      color: "text-destructive",
    },
  ];

  return (
    <div className={cn("grid grid-cols-3 gap-3", className)}>
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-border bg-card p-3 text-center"
        >
          <item.icon className={cn("mx-auto mb-1.5 h-4 w-4", item.color)} />
          <p className="text-lg font-bold tabular-nums">{item.value}</p>
          <p className="text-[10px] text-muted-foreground">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
