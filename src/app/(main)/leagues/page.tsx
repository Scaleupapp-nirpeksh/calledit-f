"use client";

import Link from "next/link";
import { TopBar } from "@/components/layout/top-bar";
import { LeagueCard } from "@/components/league/league-card";
import { useMyLeagues } from "@/lib/queries/leagues";
import { useCurrentUser } from "@/lib/queries/users";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Users, UserPlus } from "lucide-react";

export default function LeaguesPage() {
  const { data: user } = useCurrentUser();
  const { data, isLoading } = useMyLeagues();

  const leagues = data?.leagues ?? [];

  return (
    <>
      <TopBar title="Leagues" />

      <main className="mx-auto max-w-2xl p-4">
        {/* Actions */}
        <div className="mb-4 grid grid-cols-2 gap-3">
          <Link href="/leagues/create">
            <Button className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Create League
            </Button>
          </Link>
          <Link href="/leagues/join">
            <Button variant="outline" className="w-full">
              <UserPlus className="mr-2 h-4 w-4" />
              Join League
            </Button>
          </Link>
        </div>

        {/* League list */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : leagues.length > 0 ? (
          <div className="space-y-3">
            {leagues.map((league) => (
              <LeagueCard
                key={league.id}
                league={league}
                isOwner={league.owner_id === user?.id}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Users}
            title="No leagues yet"
            description="Create a league or join one with an invite code"
          />
        )}
      </main>
    </>
  );
}
