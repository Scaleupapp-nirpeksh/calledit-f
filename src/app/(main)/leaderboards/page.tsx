"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { LeaderboardTable } from "@/components/leaderboard/leaderboard-table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  useDailyLeaderboard,
  useSeasonLeaderboard,
} from "@/lib/queries/leaderboards";
import { EmptyState } from "@/components/shared/empty-state";
import { LeaderboardRowSkeleton } from "@/components/shared/skeleton-card";
import { Trophy } from "lucide-react";

export default function LeaderboardsPage() {
  const [tab, setTab] = useState("daily");

  const { data: daily, isLoading: dailyLoading } = useDailyLeaderboard();
  const { data: season, isLoading: seasonLoading } = useSeasonLeaderboard();

  return (
    <>
      <TopBar title="Leaderboards" />

      <main className="mx-auto max-w-2xl p-4">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="daily">Today</TabsTrigger>
            <TabsTrigger value="season">Season</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="mt-4">
            {dailyLoading ? (
              <div className="rounded-xl border border-border overflow-hidden">
                <LeaderboardRowSkeleton />
                <LeaderboardRowSkeleton />
                <LeaderboardRowSkeleton />
                <LeaderboardRowSkeleton />
                <LeaderboardRowSkeleton />
              </div>
            ) : daily && daily.entries.length > 0 ? (
              <LeaderboardTable data={daily} />
            ) : (
              <EmptyState
                icon={Trophy}
                title="No entries yet"
                description="Play today's matches to appear on the daily leaderboard"
              />
            )}
          </TabsContent>

          <TabsContent value="season" className="mt-4">
            {seasonLoading ? (
              <div className="rounded-xl border border-border overflow-hidden">
                <LeaderboardRowSkeleton />
                <LeaderboardRowSkeleton />
                <LeaderboardRowSkeleton />
                <LeaderboardRowSkeleton />
                <LeaderboardRowSkeleton />
              </div>
            ) : season && season.entries.length > 0 ? (
              <LeaderboardTable data={season} />
            ) : (
              <EmptyState
                icon={Trophy}
                title="No entries yet"
                description="Season leaderboard updates as matches are played"
              />
            )}
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
