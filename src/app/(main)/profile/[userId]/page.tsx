"use client";

import { use } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { StatsGrid } from "@/components/profile/stats-grid";
import { BadgeGrid } from "@/components/profile/badge-grid";
import { useUser } from "@/lib/queries/users";
import { cn } from "@/lib/utils";
import { getTeamColors } from "@/lib/utils/team";
import { Loader2, Zap, Target } from "lucide-react";

export default function PublicProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = use(params);
  const { data: user, isLoading } = useUser(userId);

  if (isLoading || !user) {
    return (
      <>
        <TopBar title="Profile" showBack />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </>
    );
  }

  const teamColors = user.favourite_team
    ? getTeamColors(user.favourite_team)
    : null;

  return (
    <>
      <TopBar title={user.display_name} showBack />

      <main className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="border-b border-border p-4">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-bold",
                teamColors
                  ? `${teamColors.bg} ${teamColors.text}`
                  : "bg-primary/15 text-primary"
              )}
            >
              {user.display_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-bold">{user.display_name}</h2>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold tabular-nums">
                {user.stats.total_points.toLocaleString()}
              </span>
              <span className="text-xs text-muted-foreground">pts</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Target className="h-4 w-4 text-secondary" />
              <span className="text-sm font-bold tabular-nums">
                {user.stats.accuracy.toFixed(1)}%
              </span>
              <span className="text-xs text-muted-foreground">accuracy</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="border-b border-border p-4">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Statistics
          </h3>
          <StatsGrid stats={user.stats} />
        </div>

        {/* Badges */}
        <div className="p-4">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Badges ({user.badges.length})
          </h3>
          <BadgeGrid earned={user.badges} />
        </div>
      </main>
    </>
  );
}
