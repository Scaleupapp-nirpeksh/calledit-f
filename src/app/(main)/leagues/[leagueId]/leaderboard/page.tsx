"use client";

import { use } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { LeaderboardTable } from "@/components/leaderboard/leaderboard-table";
import { useLeague } from "@/lib/queries/leagues";
import { useLeagueLeaderboard } from "@/lib/queries/leaderboards";
import { EmptyState } from "@/components/shared/empty-state";
import { Loader2, Trophy } from "lucide-react";

export default function LeagueLeaderboardPage({
  params,
}: {
  params: Promise<{ leagueId: string }>;
}) {
  const { leagueId } = use(params);
  const { data: leagueData } = useLeague(leagueId);
  const { data: leaderboard, isLoading } = useLeagueLeaderboard(leagueId);

  const title = leagueData?.league.name ?? "League";

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
            description="League members' scores will appear here"
          />
        )}
      </main>
    </>
  );
}
