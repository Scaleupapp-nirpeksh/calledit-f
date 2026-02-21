"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TopBar } from "@/components/layout/top-bar";
import { useCreateLeague } from "@/lib/queries/leagues";
import { useCompetitions } from "@/lib/queries/competitions";
import { Button } from "@/components/ui/button";
import { Loader2, Users } from "lucide-react";
import { toast } from "sonner";

export default function CreateLeaguePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [competitionId, setCompetitionId] = useState("");
  const mutation = useCreateLeague();
  const { data: compsData } = useCompetitions();

  const competitions = compsData?.competitions ?? [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    mutation.mutate(
      {
        name: name.trim(),
        competition_id: competitionId || undefined,
      },
      {
        onSuccess: (data) => {
          toast.success("League created!");
          router.push(`/leagues/${data.league.id}`);
        },
        onError: (err) => {
          const message =
            (err as { response?: { data?: { detail?: string } } }).response
              ?.data?.detail ?? "Failed to create league";
          toast.error(message);
        },
      }
    );
  };

  return (
    <>
      <TopBar title="Create League" showBack />

      <main className="mx-auto max-w-md p-4">
        <div className="mb-6 flex flex-col items-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Users className="h-7 w-7 text-primary" />
          </div>
          <h2 className="text-lg font-bold">Create a League</h2>
          <p className="mt-1 text-sm text-muted-foreground text-center">
            Compete with friends in your own private league
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              League Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Office Cricket Club"
              maxLength={50}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {name.length}/50 characters
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Competition (optional)
            </label>
            <select
              value={competitionId}
              onChange={(e) => setCompetitionId(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            >
              <option value="">All matches</option>
              {competitions.map((comp) => (
                <option key={comp.id} value={comp.id}>
                  {comp.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-muted-foreground">
              Scope the league to a specific competition
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!name.trim() || name.trim().length < 3 || mutation.isPending}
          >
            {mutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Users className="mr-2 h-4 w-4" />
            )}
            Create League
          </Button>
        </form>
      </main>
    </>
  );
}
