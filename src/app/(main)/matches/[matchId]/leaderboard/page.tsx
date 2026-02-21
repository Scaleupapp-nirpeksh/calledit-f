"use client";

import { use } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { LeaderboardTable } from "@/components/leaderboard/leaderboard-table";
import { useMatch } from "@/lib/queries/matches";
import { useMatchLeaderboard } from "@/lib/queries/leaderboards";
import { EmptyState } from "@/components/shared/empty-state";
import { Loader2, Trophy } from "lucide-react";

export default function MatchLeaderboardPage({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const { matchId } = use(params);
  const { data: match } = useMatch(matchId);
  const { data: leaderboard, isLoading } = useMatchLeaderboard(matchId);

  const title = match
    ? `${match.team1_code} vs ${match.team2_code}`
    : "Match";

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
            title="No predictions yet"
            description="Make predictions during this match to appear on the leaderboard"
          />
        )}
      </main>
    </>
  );
}
