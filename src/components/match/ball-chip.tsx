"use client";

import { cn } from "@/lib/utils";

interface BallChipProps {
  outcome: string;
  size?: "sm" | "md";
  className?: string;
}

const OUTCOME_STYLES: Record<string, string> = {
  dot: "bg-muted text-muted-foreground border-border",
  "0": "bg-muted text-muted-foreground border-border",
  "1": "bg-muted text-foreground border-border",
  "2": "bg-muted text-foreground border-border",
  "3": "bg-muted text-foreground border-border",
  "4": "bg-blue-500/20 text-blue-400 border-blue-500/40",
  "6": "bg-primary/20 text-primary border-primary/40",
  wicket: "bg-destructive/20 text-destructive border-destructive/40",
  W: "bg-destructive/20 text-destructive border-destructive/40",
};

const OUTCOME_LABELS: Record<string, string> = {
  dot: "0",
  "0": "0",
  wicket: "W",
  W: "W",
};

export function BallChip({ outcome, size = "sm", className }: BallChipProps) {
  const style = OUTCOME_STYLES[outcome] ?? OUTCOME_STYLES["1"];
  const label = OUTCOME_LABELS[outcome] ?? outcome;

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full border font-bold",
        size === "sm" && "h-6 w-6 text-[10px]",
        size === "md" && "h-8 w-8 text-xs",
        style,
        className
      )}
    >
      {label}
    </span>
  );
}
