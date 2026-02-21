"use client";

import { TopBar } from "@/components/layout/top-bar";
import { CompetitionCard } from "@/components/competition/competition-card";
import { useCompetitions } from "@/lib/queries/competitions";
import { EmptyState } from "@/components/shared/empty-state";
import { Loader2, Trophy } from "lucide-react";

export default function CompetitionsPage() {
  const { data, isLoading } = useCompetitions();

  const competitions = data?.competitions ?? [];
  const active = competitions.filter((c) => c.is_active);
  const past = competitions.filter((c) => !c.is_active);

  return (
    <>
      <TopBar title="Competitions" />
      <main className="mx-auto max-w-2xl p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : competitions.length === 0 ? (
          <EmptyState
            icon={Trophy}
            title="No competitions yet"
            description="Competitions will appear here when available"
          />
        ) : (
          <div className="space-y-6">
            {active.length > 0 && (
              <section>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Active
                </h2>
                <div className="space-y-3">
                  {active.map((comp) => (
                    <CompetitionCard key={comp.id} competition={comp} />
                  ))}
                </div>
              </section>
            )}

            {past.length > 0 && (
              <section>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Past
                </h2>
                <div className="space-y-3">
                  {past.map((comp) => (
                    <CompetitionCard key={comp.id} competition={comp} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </>
  );
}
