"use client";

import { use, useEffect } from "react";
import Link from "next/link";
import { TopBar } from "@/components/layout/top-bar";
import { LiveScoreHeader } from "@/components/match/live-score-header";
import { CommentaryFeed } from "@/components/match/commentary-feed";
import { BallLogStrip } from "@/components/match/ball-log-strip";
import { AiContent } from "@/components/match/ai-content";
import { BallPredictionPanel } from "@/components/prediction/ball-prediction-panel";
import { OverPredictionPanel } from "@/components/prediction/over-prediction-panel";
import { MatchWinnerPanel } from "@/components/prediction/match-winner-panel";
import { MilestonePredictionPanel } from "@/components/prediction/milestone-prediction-panel";
import { MlProbabilityChart } from "@/components/prediction/ml-probability-chart";
import { WinProbabilityBar } from "@/components/prediction/win-probability-bar";
import { PredictionSummaryCard } from "@/components/prediction/prediction-summary-card";
import { PredictionResultListener } from "@/components/prediction/prediction-result-toast";
import { ShareButton } from "@/components/shared/share-button";
import {
  useMatch,
  useAiPreview,
  useAiReport,
  useGenerateAiPreview,
  useGenerateAiReport,
} from "@/lib/queries/matches";
import { useMatchPredictionSummary } from "@/lib/queries/predictions";
import { useMatchRoom } from "@/lib/socket/hooks";
import { useMatchStore } from "@/lib/stores/match-store";
import { usePredictionStore } from "@/lib/stores/prediction-store";
import {
  isLiveStatus,
  formatMatchDate,
  getMatchStartTime,
  formatDateTimeIST,
} from "@/lib/utils/format";
import {
  Loader2,
  MapPin,
  ClipboardList,
  Brain,
  BarChart3,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function MatchDetailPage({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const { matchId } = use(params);

  // REST data (initial load + non-live matches)
  const { data: restMatch, isLoading } = useMatch(matchId);
  const {
    data: aiPreview,
    isError: previewError,
    isLoading: previewLoading,
  } = useAiPreview(matchId);
  const {
    data: aiReport,
    isError: reportError,
    isLoading: reportLoading,
  } = useAiReport(matchId);

  // Prediction summary (for syncing boost/streak state)
  const { data: predSummary } = useMatchPredictionSummary(matchId);

  // Mutations for generating AI content
  const generatePreview = useGenerateAiPreview(matchId);
  const generateReport = useGenerateAiReport(matchId);

  // Socket: join match room for live updates
  const isLive = restMatch ? isLiveStatus(restMatch.status) : false;
  useMatchRoom(isLive ? matchId : null);

  // Live state from socket (overrides REST when available)
  const liveMatch = useMatchStore((s) => s.match);
  const predictionWindow = useMatchStore((s) => s.predictionWindow);
  const match = liveMatch?.id === matchId ? liveMatch : restMatch;

  // Sync prediction summary to store
  const syncSummary = usePredictionStore((s) => s.syncSummary);
  const openWindow = usePredictionStore((s) => s.openWindow);
  const closeWindow = usePredictionStore((s) => s.closeWindow);
  const resetPredictions = usePredictionStore((s) => s.reset);

  useEffect(() => {
    if (predSummary) {
      syncSummary({
        boostsUsed: predSummary.confidence_boosts_used,
        boostsRemaining: predSummary.confidence_boosts_remaining,
        currentStreak: predSummary.current_streak,
        totalPoints: predSummary.total_points,
      });
    }
  }, [predSummary, syncSummary]);

  // Sync prediction window open/close to prediction store
  useEffect(() => {
    if (predictionWindow?.isOpen) {
      openWindow();
    } else {
      closeWindow();
    }
  }, [predictionWindow?.isOpen, openWindow, closeWindow]);

  // Reset prediction store on unmount
  useEffect(() => {
    return () => resetPredictions();
  }, [resetPredictions]);

  if (isLoading || !match) {
    return (
      <>
        <TopBar title="Match" showBack />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </>
    );
  }

  const live = isLiveStatus(match.status);
  const isCompleted = match.status === "completed";
  const isUpcoming = match.status === "upcoming";

  // Determine which AI content to show
  const aiContent = isCompleted ? aiReport?.content : aiPreview?.content;
  const aiLoading = isCompleted ? reportLoading : previewLoading;
  const aiMissing = isCompleted
    ? !aiReport?.content && (reportError || !reportLoading)
    : !aiPreview?.content && (previewError || !previewLoading);

  const handleGenerate = () => {
    const mutation = isCompleted ? generateReport : generatePreview;
    mutation.mutate(undefined, {
      onSuccess: () => {
        toast.success(
          isCompleted
            ? "AI Report generated successfully"
            : "AI Preview generated successfully"
        );
      },
      onError: () => {
        toast.error("Failed to generate AI content. Try again later.");
      },
    });
  };

  const isGenerating =
    generatePreview.isPending || generateReport.isPending;

  return (
    <>
      <TopBar
        title={`${match.team1_code} vs ${match.team2_code}`}
        showBack
        rightAction={
          <div className="flex items-center gap-1">
            <ShareButton
              title={`${match.team1_code} vs ${match.team2_code} — CalledIt`}
              text={`Follow ${match.team1_code} vs ${match.team2_code} on CalledIt!`}
              url={`${typeof window !== "undefined" ? window.location.origin : ""}/matches/${matchId}`}
              className="h-8 w-8"
            />
            <Link href={`/matches/${matchId}/scorecard`}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ClipboardList className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        }
      />

      <main className="mx-auto max-w-2xl">
        {/* Live Score Header */}
        <div className="p-4">
          <LiveScoreHeader match={match} />
        </div>

        {/* Venue + Date */}
        <div className="flex items-center justify-between border-b border-border px-4 pb-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span className="truncate">{match.venue}</span>
          </div>
          <span className="shrink-0 text-xs text-muted-foreground">
            {(() => {
              const startTime = getMatchStartTime(match);
              return startTime
                ? formatDateTimeIST(startTime)
                : formatMatchDate(match.date);
            })()}
          </span>
        </div>

        {/* Win Probability (live + completed) */}
        {(live || isCompleted) && (
          <div className="p-4 pb-0">
            <WinProbabilityBar match={match} />
          </div>
        )}

        {/* Prediction Summary (streak, points, boosts) */}
        {(live || isCompleted) && (
          <div className="p-4 pb-0">
            <PredictionSummaryCard matchId={matchId} />
          </div>
        )}

        {/* Ball Prediction Panel (live only) */}
        {live && (
          <div className="p-4 pb-0">
            <BallPredictionPanel matchId={matchId} />
          </div>
        )}

        {/* ML Probability Chart (live only) */}
        {live && (
          <div className="p-4 pb-0">
            <MlProbabilityChart matchId={matchId} isLive={live} />
          </div>
        )}

        {/* Live: Ball log strip + Commentary */}
        {live && (
          <div className="border-b border-border p-4 space-y-4">
            <BallLogStrip />
            <div>
              <h3 className="mb-2 text-sm font-semibold">Live Commentary</h3>
              <CommentaryFeed />
            </div>
          </div>
        )}

        {/* Other Prediction Types (live only) */}
        {live && (
          <div className="space-y-4 p-4">
            {/* Over Prediction */}
            {match.current_innings && match.current_over != null && (
              <OverPredictionPanel
                matchId={matchId}
                innings={match.current_innings}
                over={match.current_over}
              />
            )}

            {/* Match Winner */}
            <MatchWinnerPanel
              matchId={matchId}
              team1={match.team1}
              team1Code={match.team1_code}
              team1Img={match.team1_img}
              team2={match.team2}
              team2Code={match.team2_code}
              team2Img={match.team2_img}
              currentPick={
                predSummary?.predictions?.find(
                  (p) => p.type === "match_winner"
                )?.prediction ?? null
              }
            />

            {/* Milestone */}
            <MilestonePredictionPanel matchId={matchId} />
          </div>
        )}

        {/* AI Insights */}
        {aiLoading ? (
          <div className="border-b border-border p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading AI insights...</span>
            </div>
          </div>
        ) : aiContent ? (
          <div className="border-b border-border p-4">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15">
                <Brain className="h-4 w-4 text-primary" />
              </div>
              <h3 className="text-sm font-semibold">
                {isCompleted ? "AI Match Report" : "AI Preview"}
              </h3>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <AiContent content={aiContent} />
            </div>
          </div>
        ) : (
          aiMissing &&
          (isUpcoming || isCompleted) && (
            <div className="border-b border-border p-4">
              <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border bg-muted/20 py-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">
                    {isCompleted
                      ? "AI Report not available"
                      : "AI Preview not available"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {isCompleted
                      ? "Generate an AI analysis of this match"
                      : "Generate an AI preview for this upcoming match"}
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  {isGenerating
                    ? "Generating..."
                    : isCompleted
                      ? "Generate Report"
                      : "Generate Preview"}
                </Button>
              </div>
            </div>
          )
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 p-4">
          <Link href={`/matches/${matchId}/scorecard`}>
            <Button variant="outline" className="w-full">
              <ClipboardList className="mr-2 h-4 w-4" />
              Scorecard
            </Button>
          </Link>
          <Link href={`/matches/${matchId}/leaderboard`}>
            <Button variant="outline" className="w-full">
              <BarChart3 className="mr-2 h-4 w-4" />
              Leaderboard
            </Button>
          </Link>
        </div>
      </main>

      {/* Prediction result listener (invisible — handles toasts) */}
      {live && <PredictionResultListener />}
    </>
  );
}
