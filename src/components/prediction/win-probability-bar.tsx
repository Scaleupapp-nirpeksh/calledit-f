"use client";

import type { Match } from "@/lib/types/match";
import { estimateWinProbability } from "@/lib/utils/win-probability";
import { TrendingUp } from "lucide-react";

interface WinProbabilityBarProps {
  match: Match;
}

export function WinProbabilityBar({ match }: WinProbabilityBarProps) {
  const prob = estimateWinProbability(match);
  if (!prob) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold">Win Probability</span>
      </div>

      {/* Team labels with percentages */}
      <div className="mb-2 flex items-center justify-between text-xs font-bold">
        <span className="text-primary">{match.team1_code} {prob.team1}%</span>
        <span className="text-secondary">{match.team2_code} {prob.team2}%</span>
      </div>

      {/* Split bar */}
      <div className="flex h-3 w-full overflow-hidden rounded-full">
        <div
          className="bg-primary transition-all duration-700 ease-out"
          style={{ width: `${prob.team1}%` }}
        />
        <div
          className="bg-secondary transition-all duration-700 ease-out"
          style={{ width: `${prob.team2}%` }}
        />
      </div>
    </div>
  );
}
