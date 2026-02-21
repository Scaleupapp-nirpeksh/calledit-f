"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MatchCard } from "./match-card";
import { useMatches, useLiveMatches } from "@/lib/queries/matches";
import { sortMatchesByDate } from "@/lib/utils/format";
import { MatchCardSkeleton } from "@/components/shared/skeleton-card";
import { Radio, Calendar, Trophy } from "lucide-react";
import type { Match } from "@/lib/types/match";

type TabValue = "live" | "upcoming" | "completed";

export function MatchList() {
  const [tab, setTab] = useState<TabValue>("live");

  const today = new Date().toISOString().split("T")[0];
  const { data: liveData, isLoading: liveLoading } = useLiveMatches();
  const { data: upcomingData, isLoading: upcomingLoading } = useMatches({
    status: "upcoming",
    date: today,
    limit: 20,
  });
  const { data: completedData, isLoading: completedLoading } = useMatches({
    status: "completed",
    limit: 20,
  });

  const liveMatches = sortMatchesByDate(liveData?.matches ?? [], "asc");
  const upcomingMatches = sortMatchesByDate(upcomingData?.matches ?? [], "asc");
  const completedMatches = sortMatchesByDate(completedData?.matches ?? [], "desc");

  return (
    <Tabs value={tab} onValueChange={(v) => setTab(v as TabValue)}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="live" className="relative gap-1.5">
          <Radio className="h-3.5 w-3.5" />
          Live
          {liveMatches.length > 0 && (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
              {liveMatches.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="upcoming" className="gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          Upcoming
        </TabsTrigger>
        <TabsTrigger value="completed" className="gap-1.5">
          <Trophy className="h-3.5 w-3.5" />
          Completed
        </TabsTrigger>
      </TabsList>

      <TabsContent value="live" className="mt-4">
        <MatchTabContent
          matches={liveMatches}
          isLoading={liveLoading}
          emptyIcon={<Radio className="h-8 w-8 text-muted-foreground/30" />}
          emptyTitle="No live matches"
          emptyMessage="Check back when a match is in progress to predict ball-by-ball outcomes."
        />
      </TabsContent>

      <TabsContent value="upcoming" className="mt-4">
        <MatchTabContent
          matches={upcomingMatches}
          isLoading={upcomingLoading}
          emptyIcon={<Calendar className="h-8 w-8 text-muted-foreground/30" />}
          emptyTitle="No upcoming matches"
          emptyMessage="New matches will appear here when they're scheduled."
        />
      </TabsContent>

      <TabsContent value="completed" className="mt-4">
        <MatchTabContent
          matches={completedMatches}
          isLoading={completedLoading}
          emptyIcon={<Trophy className="h-8 w-8 text-muted-foreground/30" />}
          emptyTitle="No completed matches"
          emptyMessage="Match results and your prediction stats will show up here."
        />
      </TabsContent>
    </Tabs>
  );
}

function MatchTabContent({
  matches,
  isLoading,
  emptyIcon,
  emptyTitle,
  emptyMessage,
}: {
  matches: Match[];
  isLoading: boolean;
  emptyIcon: React.ReactNode;
  emptyTitle: string;
  emptyMessage: string;
}) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <MatchCardSkeleton />
        <MatchCardSkeleton />
        <MatchCardSkeleton />
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center px-4">
        {emptyIcon}
        <p className="mt-3 text-sm font-medium">{emptyTitle}</p>
        <p className="mt-1 text-xs text-muted-foreground max-w-60">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  );
}
