"use client";

import { use, useState } from "react";
import Link from "next/link";
import { TopBar } from "@/components/layout/top-bar";
import { useLeague } from "@/lib/queries/leagues";
import { useCurrentUser } from "@/lib/queries/users";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Loader2,
  Users,
  Crown,
  Trophy,
  Copy,
  Check,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

export default function LeagueDetailPage({
  params,
}: {
  params: Promise<{ leagueId: string }>;
}) {
  const { leagueId } = use(params);
  const { data, isLoading } = useLeague(leagueId);
  const { data: user } = useCurrentUser();
  const [copied, setCopied] = useState(false);

  if (isLoading || !data) {
    return (
      <>
        <TopBar title="League" showBack />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </>
    );
  }

  const league = data.league;

  const copyInviteCode = async () => {
    try {
      await navigator.clipboard.writeText(league.invite_code);
      setCopied(true);
      toast.success("Invite code copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const sortedMembers = [...league.members].sort(
    (a, b) => (b.total_points ?? 0) - (a.total_points ?? 0)
  );

  return (
    <>
      <TopBar title={league.name} showBack />

      <main className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="border-b border-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="font-bold">{league.name}</h2>
              <p className="text-sm text-muted-foreground">
                {league.member_count}/{league.max_members} members
              </p>
            </div>
          </div>

          {/* Invite Code */}
          <div className="mt-4 flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Invite Code</p>
              <p className="font-mono text-lg font-bold tracking-widest">
                {league.invite_code}
              </p>
            </div>
            <button
              onClick={copyInviteCode}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors cursor-pointer"
            >
              {copied ? (
                <Check className="h-4 w-4 text-primary" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>

          <Link href={`/leagues/${leagueId}/leaderboard`}>
            <Button variant="outline" size="sm" className="mt-3">
              <Trophy className="mr-1.5 h-3.5 w-3.5" />
              Full Leaderboard
            </Button>
          </Link>
        </div>

        {/* Members */}
        <div className="p-4">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Members ({league.member_count})
          </h3>
          <div className="rounded-xl border border-border overflow-hidden">
            {sortedMembers.map((member, idx) => (
              <div
                key={member.user_id}
                className={cn(
                  "flex items-center gap-3 px-4 py-3",
                  idx > 0 && "border-t border-border"
                )}
              >
                <span className="w-6 text-center text-xs font-bold tabular-nums text-muted-foreground">
                  {member.rank ?? idx + 1}
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-bold">
                  {(member.display_name ?? member.username ?? "?")
                    .charAt(0)
                    .toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium truncate">
                      {member.display_name ?? member.username ?? "User"}
                    </span>
                    {member.user_id === league.owner_id && (
                      <Crown className="h-3 w-3 shrink-0 text-yellow-500" />
                    )}
                    {member.user_id === user?.id && (
                      <span className="shrink-0 rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                        You
                      </span>
                    )}
                  </div>
                  {member.username && (
                    <span className="text-xs text-muted-foreground">
                      @{member.username}
                    </span>
                  )}
                </div>
                {member.total_points != null && (
                  <div className="flex items-center gap-1">
                    <Zap className="h-3 w-3 text-primary" />
                    <span className="text-sm font-bold tabular-nums">
                      {member.total_points}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
