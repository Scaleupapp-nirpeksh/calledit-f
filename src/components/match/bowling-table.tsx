"use client";

import type { ScorecardBowler } from "@/lib/types/match";
import { cn } from "@/lib/utils";

interface BowlingTableProps {
  bowlers: ScorecardBowler[];
}

export function BowlingTable({ bowlers }: BowlingTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-xs text-muted-foreground">
            <th className="pb-2 pr-2 text-left font-medium">Bowler</th>
            <th className="w-10 pb-2 text-right font-medium">O</th>
            <th className="w-10 pb-2 text-right font-medium">M</th>
            <th className="w-10 pb-2 text-right font-medium">R</th>
            <th className="w-10 pb-2 text-right font-medium">W</th>
            <th className="w-14 pb-2 text-right font-medium">Eco</th>
          </tr>
        </thead>
        <tbody>
          {bowlers.map((b) => (
            <tr
              key={b.bowler.id}
              className="border-b border-border/50 last:border-0"
            >
              <td className="py-2 pr-2">
                <p className="font-medium text-muted-foreground">
                  {b.bowler.name}
                </p>
              </td>
              <td className="py-2 text-right tabular-nums text-muted-foreground">
                {b.o}
              </td>
              <td className="py-2 text-right tabular-nums text-muted-foreground">
                {b.m}
              </td>
              <td className="py-2 text-right tabular-nums text-muted-foreground">
                {b.r}
              </td>
              <td
                className={cn(
                  "py-2 text-right tabular-nums font-semibold",
                  b.w >= 3 ? "text-primary" : "text-foreground"
                )}
              >
                {b.w}
              </td>
              <td
                className={cn(
                  "py-2 text-right tabular-nums",
                  b.eco <= 6
                    ? "text-primary"
                    : b.eco >= 10
                      ? "text-destructive"
                      : "text-muted-foreground"
                )}
              >
                {b.eco.toFixed(1)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
