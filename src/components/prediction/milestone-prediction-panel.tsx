"use client";

import { useState } from "react";
import { MILESTONE_TYPES, type MilestoneType } from "@/lib/types/constants";
import { useCreateMilestonePrediction } from "@/lib/queries/predictions";
import { useMatchPlayers } from "@/lib/queries/matches";
import { cn } from "@/lib/utils";
import { Loader2, Award, ChevronDown } from "lucide-react";
import { toast } from "sonner";

interface MilestonePredictionPanelProps {
  matchId: string;
}

const MILESTONE_LABELS: Record<MilestoneType, string> = {
  batter_50: "Batter 50",
  batter_100: "Batter 100",
  bowler_3w: "Bowler 3W",
  bowler_5w: "Bowler 5W",
  team_200: "Team 200+",
};

function isBatterMilestone(type: MilestoneType) {
  return type === "batter_50" || type === "batter_100";
}

function isBowlerMilestone(type: MilestoneType) {
  return type === "bowler_3w" || type === "bowler_5w";
}

export function MilestonePredictionPanel({
  matchId,
}: MilestonePredictionPanelProps) {
  const [milestoneType, setMilestoneType] = useState<MilestoneType | null>(
    null
  );
  const [playerName, setPlayerName] = useState("");
  const [willAchieve, setWillAchieve] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const mutation = useCreateMilestonePrediction(matchId);
  const { data: playersData } = useMatchPlayers(matchId);

  const needsPlayer = milestoneType && milestoneType !== "team_200";

  // Determine which player list to show based on milestone type
  const playerOptions: string[] = milestoneType
    ? isBatterMilestone(milestoneType)
      ? playersData?.batters ?? []
      : isBowlerMilestone(milestoneType)
        ? playersData?.bowlers ?? []
        : []
    : [];

  const hasPlayerOptions = playerOptions.length > 0;

  const canSubmit =
    milestoneType &&
    willAchieve !== null &&
    (!needsPlayer || playerName.trim().length > 0) &&
    !mutation.isPending;

  const handleMilestoneTypeChange = (type: MilestoneType) => {
    setMilestoneType(type);
    setPlayerName("");
  };

  const handleSubmit = () => {
    if (!milestoneType || willAchieve === null) return;

    mutation.mutate(
      {
        match_id: matchId,
        milestone_type: milestoneType,
        player_name: needsPlayer ? playerName.trim() : "Team",
        will_achieve: willAchieve,
      },
      {
        onSuccess: () => {
          setSubmitted(true);
          toast.success("Milestone prediction submitted!");
        },
        onError: (err) => {
          const message =
            (err as { response?: { data?: { detail?: string } } }).response
              ?.data?.detail ?? "Failed to submit prediction";
          toast.error(message);
        },
      }
    );
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 text-sm text-primary">
          <Award className="h-4 w-4" />
          <span className="font-medium">
            Milestone prediction submitted
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center gap-2">
        <Award className="h-4 w-4 text-purple-400" />
        <span className="text-sm font-semibold">Milestone Prediction</span>
        <span className="text-xs text-muted-foreground">(50pts)</span>
      </div>

      {/* Milestone type selector */}
      <div className="mb-3 flex flex-wrap gap-2">
        {MILESTONE_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => handleMilestoneTypeChange(type)}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-xs font-medium transition-all cursor-pointer",
              milestoneType === type
                ? "border-purple-500 bg-purple-500/15 text-purple-400"
                : "border-border text-muted-foreground hover:border-purple-500/40"
            )}
          >
            {MILESTONE_LABELS[type]}
          </button>
        ))}
      </div>

      {/* Player selection (dropdown or free text fallback) */}
      {needsPlayer && (
        hasPlayerOptions ? (
          <div className="relative mb-3">
            <select
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full appearance-none rounded-lg border border-border bg-background px-3 py-2 pr-8 text-sm outline-none focus:border-purple-500"
            >
              <option value="">
                Select {isBatterMilestone(milestoneType!) ? "batter" : "bowler"}...
              </option>
              {playerOptions.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        ) : (
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Player name..."
            className="mb-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-purple-500"
          />
        )
      )}

      {/* Yes/No selector */}
      {milestoneType && (
        <div className="mb-3 grid grid-cols-2 gap-2">
          <button
            onClick={() => setWillAchieve(true)}
            className={cn(
              "rounded-lg border-2 py-2 text-sm font-semibold transition-all cursor-pointer",
              willAchieve === true
                ? "border-primary bg-primary/15 text-primary"
                : "border-border text-muted-foreground hover:border-primary/40"
            )}
          >
            Will achieve
          </button>
          <button
            onClick={() => setWillAchieve(false)}
            className={cn(
              "rounded-lg border-2 py-2 text-sm font-semibold transition-all cursor-pointer",
              willAchieve === false
                ? "border-destructive bg-destructive/15 text-destructive"
                : "border-border text-muted-foreground hover:border-destructive/40"
            )}
          >
            Won&apos;t achieve
          </button>
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all",
          canSubmit
            ? "bg-purple-500 text-white hover:bg-purple-400 active:scale-[0.98] cursor-pointer"
            : "bg-muted text-muted-foreground cursor-not-allowed"
        )}
      >
        {mutation.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Submit"
        )}
      </button>
    </div>
  );
}
