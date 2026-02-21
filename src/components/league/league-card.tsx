"use client";

import Link from "next/link";
import type { League } from "@/lib/types/league";
import { Users, Crown, ChevronRight } from "lucide-react";

interface LeagueCardProps {
  league: League;
  isOwner?: boolean;
}

export function LeagueCard({ league, isOwner }: LeagueCardProps) {
  return (
    <Link href={`/leagues/${league.id}`}>
      <div className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Users className="h-6 w-6" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-semibold">{league.name}</h3>
            {isOwner && (
              <Crown className="h-3.5 w-3.5 shrink-0 text-yellow-500" />
            )}
          </div>
          <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
            <span>
              {league.member_count}/{league.max_members} members
            </span>
            <span className="font-mono text-[10px]">
              {league.invite_code}
            </span>
          </div>
        </div>

        <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
    </Link>
  );
}
