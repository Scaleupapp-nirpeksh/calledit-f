"use client";

import { useState } from "react";
import { useCreateOverPrediction } from "@/lib/queries/predictions";
import { cn } from "@/lib/utils";
import { Loader2, TrendingUp } from "lucide-react";
import { toast } from "sonner";

interface OverPredictionPanelProps {
  matchId: string;
  innings: number;
  over: number;
}

const QUICK_PICKS = [4, 6, 8, 10, 12, 15];

export function OverPredictionPanel({
  matchId,
  innings,
  over,
}: OverPredictionPanelProps) {
  const [runs, setRuns] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const mutation = useCreateOverPrediction(matchId);

  const handleSubmit = () => {
    if (runs === null || mutation.isPending) return;

    mutation.mutate(
      { match_id: matchId, innings, over, predicted_runs: runs },
      {
        onSuccess: () => {
          setSubmitted(true);
          toast.success("Over prediction submitted!");
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
          <TrendingUp className="h-4 w-4" />
          <span className="font-medium">
            Over {over} prediction: {runs} runs
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-secondary" />
        <span className="text-sm font-semibold">Predict Over {over} Runs</span>
        <span className="text-xs text-muted-foreground">
          (Exact = 25pts, ±3 = 10pts)
        </span>
      </div>

      {/* Quick picks */}
      <div className="mb-3 grid grid-cols-6 gap-2">
        {QUICK_PICKS.map((r) => (
          <button
            key={r}
            onClick={() => setRuns(r)}
            className={cn(
              "flex h-10 items-center justify-center rounded-lg border text-sm font-bold transition-all",
              runs === r
                ? "border-secondary bg-secondary/20 text-secondary"
                : "border-border text-muted-foreground hover:border-secondary/50 cursor-pointer"
            )}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Custom input + submit */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRuns(Math.max(0, (runs ?? 0) - 1))}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-sm font-bold hover:bg-muted cursor-pointer"
          >
            -
          </button>
          <input
            type="number"
            min={0}
            max={50}
            value={runs ?? ""}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10);
              setRuns(isNaN(v) ? null : Math.min(50, Math.max(0, v)));
            }}
            placeholder="0"
            className="h-8 w-14 rounded-lg border border-border bg-background px-2 text-center text-sm font-bold tabular-nums outline-none focus:border-secondary"
          />
          <button
            onClick={() => setRuns(Math.min(50, (runs ?? 0) + 1))}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-sm font-bold hover:bg-muted cursor-pointer"
          >
            +
          </button>
        </div>
        <button
          onClick={handleSubmit}
          disabled={runs === null || mutation.isPending}
          className={cn(
            "ml-auto flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all",
            runs !== null
              ? "bg-secondary text-secondary-foreground hover:bg-secondary/90 active:scale-95 cursor-pointer"
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
    </div>
  );
}
