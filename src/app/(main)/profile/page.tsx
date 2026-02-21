"use client";

import Link from "next/link";
import { TopBar } from "@/components/layout/top-bar";
import { StatsGrid } from "@/components/profile/stats-grid";
import { BadgeGrid } from "@/components/profile/badge-grid";
import { useCurrentUser } from "@/lib/queries/users";
import { usePredictionStats } from "@/lib/queries/predictions";
import { Button } from "@/components/ui/button";
import { ProfileHeaderSkeleton, StatsGridSkeleton } from "@/components/shared/skeleton-card";
import { cn } from "@/lib/utils";
import { getTeamColors } from "@/lib/utils/team";
import {
  Settings,
  History,
  Copy,
  Check,
  Zap,
  Target,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ProfilePage() {
  const { data: user, isLoading } = useCurrentUser();
  const { data: predStats } = usePredictionStats();
  const [copied, setCopied] = useState(false);

  if (isLoading || !user) {
    return (
      <>
        <TopBar title="Profile" />
        <main className="mx-auto max-w-2xl">
          <ProfileHeaderSkeleton />
          <div className="border-b border-border p-4">
            <StatsGridSkeleton />
          </div>
        </main>
      </>
    );
  }

  const teamColors = user.favourite_team
    ? getTeamColors(user.favourite_team)
    : null;

  const copyReferralCode = async () => {
    try {
      await navigator.clipboard.writeText(user.referral_code);
      setCopied(true);
      toast.success("Referral code copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <>
      <TopBar
        title="Profile"
        rightAction={
          <Link href="/profile/edit">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>
        }
      />

      <main className="mx-auto max-w-2xl">
        {/* Profile Header */}
        <div className="border-b border-border p-4">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-bold",
                teamColors
                  ? `${teamColors.bg} ${teamColors.text}`
                  : "bg-primary/15 text-primary"
              )}
            >
              {user.display_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-bold">{user.display_name}</h2>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
              {user.favourite_team && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {user.favourite_team} fan
                </p>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold tabular-nums">
                {user.stats.total_points.toLocaleString()}
              </span>
              <span className="text-xs text-muted-foreground">pts</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Target className="h-4 w-4 text-secondary" />
              <span className="text-sm font-bold tabular-nums">
                {user.stats.accuracy.toFixed(1)}%
              </span>
              <span className="text-xs text-muted-foreground">accuracy</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {user.stats.matches_played} matches
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="border-b border-border p-4">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Statistics
          </h3>
          <StatsGrid stats={user.stats} />
        </div>

        {/* Prediction Type Breakdown */}
        {predStats && (
          <div className="border-b border-border p-4">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              By Prediction Type
            </h3>
            <div className="space-y-2">
              {(
                [
                  { key: "ball", label: "Ball", pts: 10 },
                  { key: "over", label: "Over", pts: 25 },
                  { key: "milestone", label: "Milestone", pts: 50 },
                  { key: "match_winner", label: "Match Winner", pts: 100 },
                ] as const
              ).map(({ key, label }) => {
                const stat = predStats.by_type[key];
                const pct =
                  stat.total > 0
                    ? Math.round((stat.correct / stat.total) * 100)
                    : 0;
                return (
                  <div
                    key={key}
                    className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2"
                  >
                    <span className="w-24 text-sm font-medium">{label}</span>
                    <div className="flex-1">
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                    <span className="w-10 text-right text-xs font-bold tabular-nums">
                      {pct}%
                    </span>
                    <span className="w-12 text-right text-xs text-muted-foreground tabular-nums">
                      {stat.correct}/{stat.total}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Badges */}
        <div className="border-b border-border p-4">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Badges ({user.badges.length})
          </h3>
          <BadgeGrid earned={user.badges} showAll />
        </div>

        {/* Referral Code */}
        <div className="border-b border-border p-4">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Referral Code
          </h3>
          <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3">
            <p className="flex-1 font-mono text-lg font-bold tracking-widest">
              {user.referral_code}
            </p>
            <button
              onClick={copyReferralCode}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors cursor-pointer"
            >
              {copied ? (
                <Check className="h-4 w-4 text-primary" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Share this code with friends to earn the Recruiter badge
          </p>
        </div>

        {/* Actions */}
        <div className="p-4 space-y-3">
          <Link href="/profile/predictions">
            <Button variant="outline" className="w-full">
              <History className="mr-2 h-4 w-4" />
              Prediction History
            </Button>
          </Link>
        </div>
      </main>
    </>
  );
}
