"use client";

import { useState } from "react";
import { useCreateMatchWinnerPrediction } from "@/lib/queries/predictions";
import { TeamBadge } from "@/components/match/team-badge";
import { cn } from "@/lib/utils";
import { Loader2, Trophy, Lock } from "lucide-react";
import { toast } from "sonner";

interface MatchWinnerPanelProps {
  matchId: string;
  team1: string;
  team1Code: string;
  team1Img?: string | null;
  team2: string;
  team2Code: string;
  team2Img?: string | null;
  currentPick?: string | null;
}

export function MatchWinnerPanel({
  matchId,
  team1,
  team1Code,
  team1Img,
  team2,
  team2Code,
  team2Img,
  currentPick = null,
}: MatchWinnerPanelProps) {
  const [selected, setSelected] = useState<string | null>(currentPick);
  const [locked, setLocked] = useState(!!currentPick);
  const mutation = useCreateMatchWinnerPrediction(matchId);

  const handleSubmit = () => {
    if (!selected || mutation.isPending || locked) return;

    mutation.mutate(
      { match_id: matchId, predicted_winner: selected },
      {
        onSuccess: () => {
          setLocked(true);
          toast.success("Match winner prediction submitted!");
        },
        onError: (err) => {
          const message =
            (err as { response?: { data?: { detail?: string } } }).response
              ?.data?.detail ?? "Failed to submit prediction";
          // If backend says already submitted, lock the UI
          if (message.toLowerCase().includes("already submitted")) {
            setLocked(true);
          }
          toast.error(message);
        },
      }
    );
  };

  const teams = [
    { name: team1, code: team1Code, img: team1Img },
    { name: team2, code: team2Code, img: team2Img },
  ];

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-yellow-500" />
          <span className="text-sm font-semibold">Predict Winner</span>
          <span className="text-xs text-muted-foreground">(100pts)</span>
        </div>
        {locked && (
          <div className="flex items-center gap-1 text-xs text-yellow-500">
            <Lock className="h-3 w-3" />
            <span>Locked</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {teams.map((team) => {
          const isSelected = selected === team.name;

          return (
            <button
              key={team.name}
              onClick={() => !locked && setSelected(team.name)}
              disabled={locked}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all",
                isSelected
                  ? "border-yellow-500 bg-yellow-500/10"
                  : "border-border",
                !locked &&
                  !isSelected &&
                  "hover:border-yellow-500/40 cursor-pointer",
                locked && !isSelected && "opacity-30"
              )}
            >
              <TeamBadge code={team.code} imgUrl={team.img} size="lg" />
              <span
                className={cn(
                  "text-sm font-medium",
                  isSelected ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {team.code}
              </span>
              {isSelected && locked && (
                <span className="text-[10px] font-medium text-yellow-500">
                  Your pick
                </span>
              )}
            </button>
          );
        })}
      </div>

      {!locked && selected && (
        <button
          onClick={handleSubmit}
          disabled={mutation.isPending}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-yellow-500 py-2.5 text-sm font-semibold text-black transition-all hover:bg-yellow-400 active:scale-[0.98] cursor-pointer"
        >
          {mutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Trophy className="h-4 w-4" />
              Confirm {selected}
            </>
          )}
        </button>
      )}
    </div>
  );
}
