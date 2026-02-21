"use client";

import { cn } from "@/lib/utils";

interface CountdownRingProps {
  secondsLeft: number;
  totalSeconds?: number;
  size?: number;
  className?: string;
}

export function CountdownRing({
  secondsLeft,
  totalSeconds = 15,
  size = 48,
  className,
}: CountdownRingProps) {
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(secondsLeft / totalSeconds, 1);
  const dashOffset = circumference * (1 - progress);

  const isUrgent = secondsLeft <= 5;
  const displaySeconds = Math.ceil(secondsLeft);

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/30"
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className={cn(
            "transition-[stroke-dashoffset] duration-100",
            isUrgent ? "text-destructive" : "text-primary"
          )}
        />
      </svg>
      <span
        className={cn(
          "absolute text-sm font-bold tabular-nums",
          isUrgent ? "text-destructive" : "text-primary"
        )}
      >
        {displaySeconds}
      </span>
    </div>
  );
}
