"use client";

import type { LeaderboardEntry, LeaderboardResponse } from "@/lib/types/leaderboard";
import { cn } from "@/lib/utils";
import { Crown, Medal, Award, Target, Zap } from "lucide-react";

interface LeaderboardTableProps {
  data: LeaderboardResponse;
}

function getRankIcon(rank: number) {
  if (rank === 1) return <Crown className="h-5 w-5 text-yellow-400" />;
  if (rank === 2) return <Medal className="h-5 w-5 text-gray-300" />;
  if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />;
  return null;
}

function PodiumEntry({ entry }: { entry: LeaderboardEntry }) {
  const isGold = entry.rank === 1;
  const isSilver = entry.rank === 2;
  const isBronze = entry.rank === 3;

  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-xl border p-3",
        isGold && "border-yellow-500/30 bg-yellow-500/5 order-2",
        isSilver && "border-gray-400/20 bg-gray-400/5 order-1",
        isBronze && "border-amber-600/20 bg-amber-600/5 order-3"
      )}
    >
      <div className="mb-1">{getRankIcon(entry.rank)}</div>
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold",
          isGold && "bg-yellow-500/20 text-yellow-400",
          isSilver && "bg-gray-400/20 text-gray-300",
          isBronze && "bg-amber-600/20 text-amber-500"
        )}
      >
        {entry.display_name.charAt(0).toUpperCase()}
      </div>
      <span className="mt-1.5 max-w-[80px] truncate text-xs font-medium">
        {entry.display_name}
      </span>
      <span className="text-xs text-muted-foreground">@{entry.username}</span>
      <div className="mt-1.5 flex items-center gap-1">
        <Zap className="h-3 w-3 text-primary" />
        <span className="text-sm font-bold tabular-nums text-primary">
          {entry.total_points}
        </span>
      </div>
    </div>
  );
}

export function LeaderboardTable({ data }: LeaderboardTableProps) {
  const top3 = data.entries.filter((e) => e.rank <= 3);
  const rest = data.entries.filter((e) => e.rank > 3);

  return (
    <div>
      {/* Podium */}
      {top3.length > 0 && (
        <div className="mb-4 grid grid-cols-3 gap-2">
          {[2, 1, 3].map((rank) => {
            const entry = top3.find((e) => e.rank === rank);
            return entry ? (
              <PodiumEntry key={entry.user_id} entry={entry} />
            ) : (
              <div key={rank} />
            );
          })}
        </div>
      )}

      {/* My Rank */}
      {data.my_entry && data.my_rank && data.my_rank > 3 && (
        <MyRankCard entry={data.my_entry} rank={data.my_rank} />
      )}

      {/* Rest of leaderboard */}
      {rest.length > 0 && (
        <div className="rounded-xl border border-border overflow-hidden">
          {rest.map((entry, idx) => (
            <div
              key={entry.user_id}
              className={cn(
                "flex items-center gap-3 px-4 py-3",
                idx > 0 && "border-t border-border"
              )}
            >
              <span className="w-8 text-center text-sm font-bold tabular-nums text-muted-foreground">
                {entry.rank}
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-bold">
                {entry.display_name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium truncate block">
                  {entry.display_name}
                </span>
                <span className="text-xs text-muted-foreground">
                  @{entry.username}
                </span>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <Zap className="h-3 w-3 text-primary" />
                  <span className="text-sm font-bold tabular-nums">
                    {entry.total_points}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {entry.accuracy.toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Total participants */}
      <p className="mt-3 text-center text-xs text-muted-foreground">
        {data.total_participants} participants
      </p>
    </div>
  );
}

function MyRankCard({ entry, rank }: { entry: LeaderboardEntry; rank: number }) {
  return (
    <div className="mb-4 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
      <span className="w-8 text-center text-sm font-bold tabular-nums text-primary">
        #{rank}
      </span>
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
        {entry.display_name.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium">You</span>
        <span className="ml-1 text-xs text-muted-foreground">
          @{entry.username}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <Zap className="h-3 w-3 text-primary" />
        <span className="text-sm font-bold tabular-nums text-primary">
          {entry.total_points}
        </span>
      </div>
    </div>
  );
}
