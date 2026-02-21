"use client";

import Link from "next/link";
import { useAuthStore } from "@/lib/stores/auth-store";
import { TopBar } from "@/components/layout/top-bar";
import { MatchCard } from "@/components/match/match-card";
import { NotificationBell } from "@/components/notification/notification-bell";
import { MatchCardSkeleton, Skeleton } from "@/components/shared/skeleton-card";
import { useMatches, useLiveMatches } from "@/lib/queries/matches";
import { useSeasonLeaderboard } from "@/lib/queries/leaderboards";
import { useCompetitions } from "@/lib/queries/competitions";
import { usePredictionStats } from "@/lib/queries/predictions";
import { sortMatchesByDate, formatCompactNumber } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import {
  Trophy,
  Target,
  Flame,
  TrendingUp,
  ChevronRight,
  Calendar,
  Medal,
  Zap,
  Radio,
  CircleOff,
} from "lucide-react";

export default function HomePage() {
  const user = useAuthStore((s) => s.user);

  const { data: liveData, isLoading: liveLoading } = useLiveMatches();
  const today = new Date().toISOString().split("T")[0];
  const { data: upcomingData, isLoading: upcomingLoading } = useMatches({
    status: "upcoming",
    date: today,
    limit: 10,
  });
  const { data: completedData, isLoading: completedLoading } = useMatches({
    status: "completed",
    limit: 5,
  });
  const { data: seasonData } = useSeasonLeaderboard();
  const { data: competitionsData } = useCompetitions({ is_active: true });
  const { data: predStats } = usePredictionStats();

  const liveMatches = sortMatchesByDate(liveData?.matches ?? [], "asc");
  const upcomingMatches = sortMatchesByDate(
    upcomingData?.matches ?? [],
    "asc"
  );
  const completedMatches = sortMatchesByDate(
    completedData?.matches ?? [],
    "desc"
  );
  const activeCompetitions = competitionsData?.competitions ?? [];

  const stats = user?.stats;
  const mySeasonRank = seasonData?.my_rank;
  const topEntries = seasonData?.entries?.slice(0, 3) ?? [];

  return (
    <>
      <TopBar title="CalledIt" rightAction={<NotificationBell />} />
      <main className="mx-auto max-w-2xl px-4 py-4 space-y-6">
        {/* Greeting */}
        <div>
          <h2 className="text-lg font-bold">
            Hey, {user?.display_name ?? "there"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {liveMatches.length > 0
              ? `${liveMatches.length} match${liveMatches.length > 1 ? "es" : ""} live right now`
              : upcomingMatches.length > 0
                ? "Matches coming up — get ready to predict"
                : "Check back soon for upcoming matches"}
          </p>
        </div>

        {/* Stats ribbon */}
        {stats ? (
          <div className="grid grid-cols-4 gap-2">
            <StatTile
              icon={<Trophy className="h-3.5 w-3.5 text-yellow-400" />}
              value={formatCompactNumber(stats.total_points)}
              label="Points"
            />
            <StatTile
              icon={<Target className="h-3.5 w-3.5 text-primary" />}
              value={`${Math.round(stats.accuracy)}%`}
              label="Accuracy"
            />
            <StatTile
              icon={<Flame className="h-3.5 w-3.5 text-orange-400" />}
              value={String(stats.current_streak)}
              label="Streak"
            />
            <StatTile
              icon={<TrendingUp className="h-3.5 w-3.5 text-secondary" />}
              value={mySeasonRank ? `#${mySeasonRank}` : "—"}
              label="Rank"
            />
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-card p-3 text-center"
              >
                <Skeleton className="mx-auto h-4 w-8 mb-1" />
                <Skeleton className="mx-auto h-3 w-12" />
              </div>
            ))}
          </div>
        )}

        {/* Live matches (prominent) */}
        {(liveLoading || liveMatches.length > 0) && (
          <section>
            <SectionHeader
              icon={<Radio className="h-4 w-4 text-primary" />}
              title="Live Now"
              count={liveMatches.length}
              pulse
            />
            {liveLoading ? (
              <div className="space-y-3 mt-3">
                <MatchCardSkeleton />
              </div>
            ) : (
              <div className="space-y-3 mt-3">
                {liveMatches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Upcoming matches */}
        <section>
          <SectionHeader
            icon={<Calendar className="h-4 w-4 text-secondary" />}
            title="Upcoming"
            count={upcomingData?.total}
          />
          {upcomingLoading ? (
            <div className="space-y-3 mt-3">
              <MatchCardSkeleton />
              <MatchCardSkeleton />
            </div>
          ) : upcomingMatches.length > 0 ? (
            <div className="space-y-3 mt-3">
              {upcomingMatches.slice(0, 5).map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <EmptyBlock message="No upcoming matches scheduled" />
          )}
        </section>

        {/* Active competitions */}
        {activeCompetitions.length > 0 && (
          <section>
            <SectionHeader
              icon={<Medal className="h-4 w-4 text-yellow-400" />}
              title="Competitions"
              href="/competitions"
            />
            <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
              {activeCompetitions.map((comp) => (
                <Link
                  key={comp.id}
                  href={`/competitions/${comp.id}`}
                  className="shrink-0"
                >
                  <div className="rounded-xl border border-border bg-card px-4 py-3 min-w-40 hover:border-primary/20 transition-colors">
                    <p className="text-sm font-semibold truncate">
                      {comp.short_name || comp.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {comp.match_count} matches &middot; {comp.season}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Season leaderboard preview */}
        {topEntries.length > 0 && (
          <section>
            <SectionHeader
              icon={<Trophy className="h-4 w-4 text-yellow-400" />}
              title="Season Leaderboard"
              href="/leaderboards"
            />
            <div className="mt-3 rounded-xl border border-border bg-card overflow-hidden">
              {topEntries.map((entry, idx) => (
                <div
                  key={entry.user_id}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5",
                    idx < topEntries.length - 1 && "border-b border-border/50"
                  )}
                >
                  <span
                    className={cn(
                      "text-xs font-bold w-5 text-center shrink-0",
                      idx === 0 && "text-yellow-400",
                      idx === 1 && "text-gray-400",
                      idx === 2 && "text-orange-400"
                    )}
                  >
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {entry.display_name}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-primary tabular-nums">
                    {formatCompactNumber(entry.total_points)} pts
                  </span>
                </div>
              ))}
              {seasonData?.my_entry && mySeasonRank && mySeasonRank > 3 && (
                <>
                  <div className="border-t border-border/50 border-dashed" />
                  <div className="flex items-center gap-3 px-4 py-2.5 bg-primary/5">
                    <span className="text-xs font-bold w-5 text-center text-primary shrink-0">
                      {mySeasonRank}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-primary truncate">
                        You
                      </p>
                    </div>
                    <span className="text-xs font-bold text-primary tabular-nums">
                      {formatCompactNumber(seasonData.my_entry.total_points)} pts
                    </span>
                  </div>
                </>
              )}
            </div>
          </section>
        )}

        {/* Recent results */}
        <section>
          <SectionHeader
            icon={<Zap className="h-4 w-4 text-muted-foreground" />}
            title="Recent Results"
          />
          {completedLoading ? (
            <div className="space-y-2 mt-3">
              <MatchCardSkeleton />
            </div>
          ) : completedMatches.length > 0 ? (
            <div className="space-y-2 mt-3">
              {completedMatches.slice(0, 5).map((match) => (
                <MatchCard key={match.id} match={match} compact />
              ))}
            </div>
          ) : (
            <EmptyBlock message="No completed matches yet" />
          )}
        </section>

        {/* Prediction stats breakdown */}
        {predStats && predStats.total_predictions > 0 && (
          <section>
            <SectionHeader
              icon={<Target className="h-4 w-4 text-primary" />}
              title="Your Predictions"
              href="/profile/predictions"
            />
            <div className="mt-3 grid grid-cols-2 gap-2">
              <PredTypeTile
                label="Ball-by-ball"
                total={predStats.by_type.ball.total}
                accuracy={predStats.by_type.ball.accuracy}
              />
              <PredTypeTile
                label="Over"
                total={predStats.by_type.over.total}
                accuracy={predStats.by_type.over.accuracy}
              />
              <PredTypeTile
                label="Milestone"
                total={predStats.by_type.milestone.total}
                accuracy={predStats.by_type.milestone.accuracy}
              />
              <PredTypeTile
                label="Match Winner"
                total={predStats.by_type.match_winner.total}
                accuracy={predStats.by_type.match_winner.accuracy}
              />
            </div>
          </section>
        )}

        <div className="h-2" />
      </main>
    </>
  );
}

/* ── Sub-components ── */

function StatTile({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-2.5 text-center">
      <div className="flex items-center justify-center gap-1 mb-0.5">
        {icon}
        <span className="text-sm font-bold tabular-nums">{value}</span>
      </div>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}

function SectionHeader({
  icon,
  title,
  href,
  count,
  pulse,
}: {
  icon: React.ReactNode;
  title: string;
  href?: string;
  count?: number;
  pulse?: boolean;
}) {
  const inner = (
    <div className="flex items-center gap-2">
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
        </span>
      )}
      {icon}
      <h3 className="text-sm font-bold">{title}</h3>
      {count != null && count > 0 && (
        <span className="text-[10px] font-semibold text-muted-foreground">
          ({count})
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <div className="flex items-center justify-between">
        {inner}
        <Link
          href={href}
          className="flex items-center gap-0.5 text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          View all
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    );
  }

  return inner;
}

function EmptyBlock({ message }: { message: string }) {
  return (
    <div className="mt-3 flex items-center gap-3 rounded-xl border border-dashed border-border px-4 py-6">
      <CircleOff className="h-5 w-5 text-muted-foreground/40 shrink-0" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

function PredTypeTile({
  label,
  total,
  accuracy,
}: {
  label: string;
  total: number;
  accuracy: number;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="mt-1 flex items-baseline justify-between">
        <span className="text-lg font-bold tabular-nums">{total}</span>
        <span
          className={cn(
            "text-xs font-semibold tabular-nums",
            accuracy >= 50 ? "text-primary" : "text-muted-foreground"
          )}
        >
          {Math.round(accuracy)}%
        </span>
      </div>
      <div className="mt-1.5 h-1 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary/70 transition-all"
          style={{ width: `${Math.min(accuracy, 100)}%` }}
        />
      </div>
    </div>
  );
}
