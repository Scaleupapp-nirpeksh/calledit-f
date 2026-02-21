"use client";

import { use } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { LeaderboardTable } from "@/components/leaderboard/leaderboard-table";
import { useCompetition } from "@/lib/queries/competitions";
import { useCompetitionLeaderboard } from "@/lib/queries/leaderboards";
import { EmptyState } from "@/components/shared/empty-state";
import { Loader2, Trophy } from "lucide-react";

export default function CompetitionLeaderboardPage({
  params,
}: {
  params: Promise<{ competitionId: string }>;
}) {
  const { competitionId } = use(params);
  const { data: competition } = useCompetition(competitionId);
  const { data: leaderboard, isLoading } =
    useCompetitionLeaderboard(competitionId);

  const title = competition?.short_name ?? "Competition";

  return (
    <>
      <TopBar title={`${title} — Leaderboard`} showBack />

      <main className="mx-auto max-w-2xl p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : leaderboard && leaderboard.entries.length > 0 ? (
          <LeaderboardTable data={leaderboard} />
        ) : (
          <EmptyState
            icon={Trophy}
            title="No entries yet"
            description="Leaderboard updates as matches are played"
          />
        )}
      </main>
    </>
  );
}
