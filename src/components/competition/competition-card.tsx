"use client";

import Link from "next/link";
import type { Competition } from "@/lib/types/competition";
import { cn } from "@/lib/utils";
import { formatDateIST } from "@/lib/utils/format";
import { Trophy, Calendar, ChevronRight } from "lucide-react";

interface CompetitionCardProps {
  competition: Competition;
}

export function CompetitionCard({ competition }: CompetitionCardProps) {
  const startDate = formatDateIST(competition.start_date);
  const endDate = formatDateIST(competition.end_date);

  return (
    <Link href={`/competitions/${competition.id}`}>
      <div className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
            competition.is_active
              ? "bg-primary/15 text-primary"
              : "bg-muted text-muted-foreground"
          )}
        >
          <Trophy className="h-6 w-6" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-semibold">{competition.name}</h3>
            {competition.is_active && (
              <span className="shrink-0 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
                Active
              </span>
            )}
          </div>
          <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {startDate} — {endDate}
            </span>
            <span>{competition.match_count} matches</span>
          </div>
        </div>

        <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
    </Link>
  );
}
