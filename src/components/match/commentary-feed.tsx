"use client";

import { useEffect, useRef } from "react";
import { useMatchStore } from "@/lib/stores/match-store";
import { BallChip } from "./ball-chip";
import { MessageSquare } from "lucide-react";

export function CommentaryFeed() {
  const commentary = useMatchStore((s) => s.commentary);
  const ballLog = useMatchStore((s) => s.ballLog);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new entries arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [commentary.length, ballLog.length]);

  // Merge ball log and commentary into a timeline
  const timeline = buildTimeline(ballLog, commentary);

  if (timeline.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <MessageSquare className="mb-2 h-8 w-8 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">
          Ball-by-ball updates will appear here
        </p>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="max-h-80 space-y-2 overflow-y-auto"
    >
      {timeline.map((entry) => (
        <div key={entry.key} className="flex gap-3 py-1.5">
          {entry.type === "ball" ? (
            <>
              <BallChip outcome={entry.outcome!} size="md" />
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    {entry.overBall}
                  </span>
                  <span className="text-sm">
                    {entry.batter} to {entry.bowler}
                  </span>
                </div>
                {entry.commentary && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {entry.commentary}
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 rounded-lg bg-muted/50 px-3 py-2">
              <p className="text-xs leading-relaxed text-muted-foreground">
                {entry.commentary}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

interface TimelineEntry {
  key: string;
  type: "ball" | "summary";
  timestamp: number;
  outcome?: string;
  overBall?: string;
  batter?: string;
  bowler?: string;
  commentary?: string;
}

function buildTimeline(
  ballLog: import("@/lib/types/match").BallLogEntry[],
  commentary: { ball_key: string; text: string; timestamp: number }[]
): TimelineEntry[] {
  const commentaryMap = new Map<string, string>();
  const summaries: TimelineEntry[] = [];

  for (const c of commentary) {
    if (c.ball_key.startsWith("summary_")) {
      summaries.push({
        key: c.ball_key,
        type: "summary",
        timestamp: c.timestamp,
        commentary: c.text,
      });
    } else {
      commentaryMap.set(c.ball_key, c.text);
    }
  }

  const ballEntries: TimelineEntry[] = ballLog.map((b) => ({
    key: `ball_${b.ball_key}`,
    type: "ball" as const,
    timestamp: 0, // balls are in order already
    outcome: b.outcome,
    overBall: `${b.over}.${b.ball}`,
    batter: b.batter,
    bowler: b.bowler,
    commentary: commentaryMap.get(b.ball_key),
  }));

  // Interleave: all balls in order, summaries appended after their over
  const result: TimelineEntry[] = [];
  let lastOver = -1;

  for (const entry of ballEntries) {
    const [overStr] = (entry.overBall ?? "0.0").split(".");
    const overNum = parseInt(overStr, 10);

    // Insert any over summary for the previous over
    if (overNum !== lastOver && lastOver >= 0) {
      const overSummary = summaries.find(
        (s) => s.key === `summary_${ballLog[0]?.innings}.${lastOver}`
      );
      if (overSummary) result.push(overSummary);
    }

    result.push(entry);
    lastOver = overNum;
  }

  // Append any remaining summaries
  if (lastOver >= 0) {
    const finalSummary = summaries.find(
      (s) => s.key === `summary_${ballLog[0]?.innings}.${lastOver}`
    );
    if (finalSummary && !result.includes(finalSummary)) {
      result.push(finalSummary);
    }
  }

  return result;
}
