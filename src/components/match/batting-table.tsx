"use client";

import type { ScorecardBatsman } from "@/lib/types/match";
import { cn } from "@/lib/utils";

interface BattingTableProps {
  batsmen: ScorecardBatsman[];
}

export function BattingTable({ batsmen }: BattingTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-xs text-muted-foreground">
            <th className="pb-2 pr-2 text-left font-medium">Batter</th>
            <th className="w-10 pb-2 text-right font-medium">R</th>
            <th className="w-10 pb-2 text-right font-medium">B</th>
            <th className="w-10 pb-2 text-right font-medium">4s</th>
            <th className="w-10 pb-2 text-right font-medium">6s</th>
            <th className="w-14 pb-2 text-right font-medium">SR</th>
          </tr>
        </thead>
        <tbody>
          {batsmen.map((b) => {
            const isNotOut =
              b["dismissal-text"] === "not out" ||
              b["dismissal-text"] === "batting";

            return (
              <tr
                key={b.batsman.id}
                className="border-b border-border/50 last:border-0"
              >
                <td className="py-2 pr-2">
                  <p
                    className={cn(
                      "font-medium",
                      isNotOut ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {b.batsman.name}
                    {isNotOut && <span className="text-primary">*</span>}
                  </p>
                  <p className="text-xs text-muted-foreground/70 truncate max-w-[200px]">
                    {b["dismissal-text"]}
                  </p>
                </td>
                <td
                  className={cn(
                    "py-2 text-right tabular-nums font-semibold",
                    b.r >= 50 ? "text-primary" : "text-foreground"
                  )}
                >
                  {b.r}
                </td>
                <td className="py-2 text-right tabular-nums text-muted-foreground">
                  {b.b}
                </td>
                <td className="py-2 text-right tabular-nums text-muted-foreground">
                  {b["4s"]}
                </td>
                <td className="py-2 text-right tabular-nums text-muted-foreground">
                  {b["6s"]}
                </td>
                <td
                  className={cn(
                    "py-2 text-right tabular-nums",
                    b.sr >= 150
                      ? "text-primary"
                      : b.sr < 80
                        ? "text-destructive"
                        : "text-muted-foreground"
                  )}
                >
                  {b.sr.toFixed(2)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
