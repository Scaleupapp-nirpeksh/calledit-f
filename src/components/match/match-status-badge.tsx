"use client";

import type { MatchStatus } from "@/lib/types/constants";
import { formatMatchStatus, isLiveStatus } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

interface MatchStatusBadgeProps {
  status: MatchStatus;
  className?: string;
}

export function MatchStatusBadge({ status, className }: MatchStatusBadgeProps) {
  const live = isLiveStatus(status);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        live && "bg-primary/15 text-primary",
        status === "upcoming" && "bg-muted text-muted-foreground",
        status === "completed" && "bg-blue-500/15 text-blue-400",
        status === "abandoned" && "bg-destructive/15 text-destructive",
        className
      )}
    >
      {live && (
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
        </span>
      )}
      {formatMatchStatus(status)}
    </span>
  );
}
