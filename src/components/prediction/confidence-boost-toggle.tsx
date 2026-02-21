"use client";

import { usePredictionStore } from "@/lib/stores/prediction-store";
import { cn } from "@/lib/utils";
import { Flame } from "lucide-react";

export function ConfidenceBoostToggle() {
  const { confidenceBoost, boostsRemaining, toggleConfidenceBoost } =
    usePredictionStore();

  const disabled = boostsRemaining <= 0 && !confidenceBoost;

  return (
    <button
      onClick={toggleConfidenceBoost}
      disabled={disabled}
      className={cn(
        "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
        confidenceBoost
          ? "border-orange-500 bg-orange-500/15 text-orange-400"
          : disabled
            ? "border-border text-muted-foreground opacity-50 cursor-not-allowed"
            : "border-border text-muted-foreground hover:border-orange-500/50 hover:text-orange-400 cursor-pointer"
      )}
    >
      <Flame className={cn("h-3.5 w-3.5", confidenceBoost && "text-orange-400")} />
      <span>2x Boost</span>
      <span className="tabular-nums">({boostsRemaining}/3)</span>
    </button>
  );
}
