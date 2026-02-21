"use client";

import { useMatchStore } from "@/lib/stores/match-store";
import { BallChip } from "./ball-chip";
import { useEffect, useRef } from "react";

/**
 * Horizontal scrolling strip showing the last N balls.
 * Auto-scrolls to the right when new balls arrive.
 */
export function BallLogStrip() {
  const ballLog = useMatchStore((s) => s.ballLog);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Show last 24 balls
  const recentBalls = ballLog.slice(-24);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [ballLog.length]);

  if (recentBalls.length === 0) return null;

  return (
    <div
      ref={scrollRef}
      className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none"
    >
      {recentBalls.map((ball) => (
        <BallChip key={ball.ball_key} outcome={ball.outcome} size="sm" />
      ))}
    </div>
  );
}
