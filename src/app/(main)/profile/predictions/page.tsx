"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { usePredictionHistory } from "@/lib/queries/predictions";
import { formatMatchDate } from "@/lib/utils/format";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2, History, ChevronLeft, ChevronRight, Zap } from "lucide-react";
import type { Prediction } from "@/lib/types/prediction";

function PredictionRow({ prediction }: { prediction: Prediction }) {
  const typeLabels: Record<string, string> = {
    ball: "Ball",
    over: "Over",
    milestone: "Milestone",
    match_winner: "Winner",
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-border last:border-b-0">
      {/* Result indicator */}
      <div
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold",
          prediction.is_correct === true &&
            "bg-primary/15 text-primary",
          prediction.is_correct === false &&
            "bg-destructive/15 text-destructive",
          prediction.is_correct === null &&
            "bg-muted text-muted-foreground"
        )}
      >
        {prediction.is_correct === true
          ? "✓"
          : prediction.is_correct === false
            ? "✗"
            : "?"}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium rounded-full border border-border px-2 py-0.5">
            {typeLabels[prediction.type] ?? prediction.type}
          </span>
          <span className="text-xs text-muted-foreground">
            {prediction.prediction}
          </span>
          {prediction.confidence_boost && (
            <span className="text-xs text-orange-400 font-medium">2x</span>
          )}
        </div>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
          {prediction.ball_key && (
            <span className="tabular-nums">Ball {prediction.ball_key}</span>
          )}
          <span>{formatMatchDate(prediction.created_at)}</span>
        </div>
      </div>

      {/* Points */}
      <div className="text-right">
        {prediction.is_resolved && (
          <div className="flex items-center gap-1">
            <Zap
              className={cn(
                "h-3 w-3",
                prediction.total_points > 0
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            />
            <span
              className={cn(
                "text-sm font-bold tabular-nums",
                prediction.total_points > 0
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {prediction.total_points > 0
                ? `+${prediction.total_points}`
                : "0"}
            </span>
          </div>
        )}
        {prediction.actual_outcome && (
          <span className="text-[10px] text-muted-foreground">
            was: {prediction.actual_outcome}
          </span>
        )}
      </div>
    </div>
  );
}

export default function PredictionHistoryPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = usePredictionHistory(page, 20);

  const predictions = data?.predictions ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / 20);

  return (
    <>
      <TopBar title="Prediction History" showBack />

      <main className="mx-auto max-w-2xl p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : predictions.length > 0 ? (
          <>
            <div className="rounded-xl border border-border overflow-hidden">
              {predictions.map((pred) => (
                <PredictionRow key={pred.id} prediction={pred} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page <= 1}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Prev
                </Button>
                <span className="text-xs text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages}
                >
                  Next
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <EmptyState
            icon={History}
            title="No predictions yet"
            description="Your prediction history will appear here"
          />
        )}
      </main>
    </>
  );
}
