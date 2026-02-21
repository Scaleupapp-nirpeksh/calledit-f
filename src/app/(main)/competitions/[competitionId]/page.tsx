"use client";

import { use } from "react";
import Link from "next/link";
import { TopBar } from "@/components/layout/top-bar";
import { MatchCard } from "@/components/match/match-card";
import { useCompetitionMatches } from "@/lib/queries/competitions";
import { EmptyState } from "@/components/shared/empty-state";
import { isLiveStatus, sortMatchesByDate, formatDateIST } from "@/lib/utils/format";
import { Loader2, Calendar, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CompetitionDetailPage({
  params,
}: {
  params: Promise<{ competitionId: string }>;
}) {
  const { competitionId } = use(params);
  const { data, isLoading } = useCompetitionMatches(competitionId);

  if (isLoading || !data) {
    return (
      <>
        <TopBar title="Competition" showBack />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </>
    );
  }

  const { competition, matches } = data;

  const liveMatches = sortMatchesByDate(
    matches.filter((m) => isLiveStatus(m.status)),
    "asc"
  );
  const upcomingMatches = sortMatchesByDate(
    matches.filter((m) => m.status === "upcoming"),
    "asc"
  );
  const completedMatches = sortMatchesByDate(
    matches.filter((m) => m.status === "completed" || m.status === "abandoned"),
    "desc"
  );

  const startDate = formatDateIST(competition.start_date);
  const endDate = formatDateIST(competition.end_date);

  return (
    <>
      <TopBar title={competition.short_name} showBack />
      <main className="mx-auto max-w-2xl">
        {/* Competition Header */}
        <div className="border-b border-border p-4">
          <h2 className="text-lg font-bold">{competition.name}</h2>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {startDate} — {endDate}
            </span>
            <span>{competition.match_count} matches</span>
            <span>{competition.match_type}</span>
            {competition.is_active && (
              <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
                Active
              </span>
            )}
          </div>

          {/* Teams */}
          {competition.teams.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {competition.teams.map((team) => (
                <span
                  key={team}
                  className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-[10px] text-muted-foreground"
                >
                  {team}
                </span>
              ))}
            </div>
          )}

          <Link href={`/competitions/${competitionId}/leaderboard`}>
            <Button variant="outline" size="sm" className="mt-3">
              <Trophy className="mr-1.5 h-3.5 w-3.5" />
              Leaderboard
            </Button>
          </Link>
        </div>

        {/* Match Sections */}
        <div className="p-4 space-y-6">
          {matches.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No matches yet"
              description="Matches for this competition will appear here"
            />
          ) : (
            <>
              {liveMatches.length > 0 && (
                <MatchSection title="Live" matches={liveMatches} />
              )}
              {upcomingMatches.length > 0 && (
                <MatchSection title="Upcoming" matches={upcomingMatches} />
              )}
              {completedMatches.length > 0 && (
                <MatchSection title="Completed" matches={completedMatches} />
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}

function MatchSection({
  title,
  matches,
}: {
  title: string;
  matches: import("@/lib/types/match").Match[];
}) {
  return (
    <section>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {title} ({matches.length})
      </h3>
      <div className="space-y-3">
        {matches.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    </section>
  );
}
