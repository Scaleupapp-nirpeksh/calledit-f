"use client";

import Link from "next/link";
import type { Match } from "@/lib/types/match";
import { MatchStatusBadge } from "./match-status-badge";
import { TeamBadge } from "./team-badge";
import {
  formatMatchDate,
  formatCountdown,
  formatDateTimeIST,
  getMatchStartTime,
  isLiveStatus,
  formatOvers,
  formatRunRate,
} from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import { ChevronRight, Clock, MapPin, Zap } from "lucide-react";

interface MatchCardProps {
  match: Match;
  /** Show a more compact version (e.g. in recent results) */
  compact?: boolean;
}

export function MatchCard({ match, compact = false }: MatchCardProps) {
  const live = isLiveStatus(match.status);
  const startTime = getMatchStartTime(match);
  const countdown = startTime ? formatCountdown(startTime) : null;

  const team1Innings = match.innings.find(
    (i) => i.batting_team.toLowerCase() === match.team1.toLowerCase()
  );
  const team2Innings = match.innings.find(
    (i) => i.batting_team.toLowerCase() === match.team2.toLowerCase()
  );

  const currentInnings =
    match.innings.length > 0
      ? match.innings[match.innings.length - 1]
      : null;

  if (compact) {
    return (
      <Link href={`/matches/${match.id}`}>
        <div
          className={cn(
            "group flex items-center gap-3 rounded-lg border bg-card/50 px-3 py-2.5 transition-all hover:bg-card hover:border-primary/20",
            live && "border-primary/20"
          )}
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <TeamBadge code={match.team1_code} imgUrl={match.team1_img} size="sm" />
            <span className="text-[10px] text-muted-foreground/60 font-bold">v</span>
            <TeamBadge code={match.team2_code} imgUrl={match.team2_img} size="sm" />
            <div className="min-w-0 flex-1 ml-1">
              {match.result_text ? (
                <p className="text-xs text-muted-foreground truncate">
                  {match.result_text}
                </p>
              ) : live && currentInnings ? (
                <p className="text-xs font-medium text-primary truncate">
                  {currentInnings.score}/{currentInnings.wickets} ({formatOvers(currentInnings.overs)})
                </p>
              ) : countdown ? (
                <p className="text-xs text-muted-foreground truncate">{countdown}</p>
              ) : (
                <p className="text-xs text-muted-foreground truncate">
                  {formatMatchDate(match.date)}
                </p>
              )}
            </div>
          </div>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/matches/${match.id}`}>
      <div
        className={cn(
          "group relative overflow-hidden rounded-xl border bg-card transition-all hover:border-primary/30",
          live &&
            "border-primary/25 shadow-[0_0_20px_rgba(var(--primary),0.08)]"
        )}
      >
        {/* Live pulse strip at top */}
        {live && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse" />
        )}

        {/* Header: match type + status + date/countdown */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <div className="flex items-center gap-2">
            <MatchStatusBadge status={match.status} />
            {match.match_type && (
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                {match.match_type}
              </span>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            {match.status === "upcoming" && countdown
              ? countdown
              : formatMatchDate(match.date)}
          </span>
        </div>

        {/* Teams + scores */}
        <div className="px-4 pb-3 space-y-1.5">
          {/* Team 1 */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <TeamBadge
                code={match.team1_code}
                imgUrl={match.team1_img}
                size="md"
              />
              <span
                className={cn(
                  "text-sm font-semibold truncate",
                  match.winner === match.team1
                    ? "text-foreground"
                    : live
                      ? "text-foreground/90"
                      : "text-muted-foreground"
                )}
              >
                {match.team1}
              </span>
              {match.winner === match.team1 && (
                <span className="text-[10px] font-bold text-primary shrink-0">WON</span>
              )}
            </div>
            {team1Innings && (
              <div className="flex items-baseline gap-1.5 shrink-0">
                <span
                  className={cn(
                    "text-sm font-bold tabular-nums",
                    match.winner === match.team1
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {team1Innings.score}/{team1Innings.wickets}
                </span>
                <span className="text-[10px] text-muted-foreground/60 tabular-nums">
                  ({formatOvers(team1Innings.overs)})
                </span>
              </div>
            )}
          </div>

          {/* Team 2 */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <TeamBadge
                code={match.team2_code}
                imgUrl={match.team2_img}
                size="md"
              />
              <span
                className={cn(
                  "text-sm font-semibold truncate",
                  match.winner === match.team2
                    ? "text-foreground"
                    : live
                      ? "text-foreground/90"
                      : "text-muted-foreground"
                )}
              >
                {match.team2}
              </span>
              {match.winner === match.team2 && (
                <span className="text-[10px] font-bold text-primary shrink-0">WON</span>
              )}
            </div>
            {team2Innings && (
              <div className="flex items-baseline gap-1.5 shrink-0">
                <span
                  className={cn(
                    "text-sm font-bold tabular-nums",
                    match.winner === match.team2
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {team2Innings.score}/{team2Innings.wickets}
                </span>
                <span className="text-[10px] text-muted-foreground/60 tabular-nums">
                  ({formatOvers(team2Innings.overs)})
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Live: run rate bar */}
        {live && currentInnings && (
          <div className="mx-4 mb-2 flex items-center gap-3 rounded-lg bg-primary/5 px-3 py-1.5">
            <Zap className="h-3 w-3 text-primary shrink-0" />
            <span className="text-[11px] font-medium text-primary">
              CRR: {formatRunRate(currentInnings.run_rate)}
            </span>
            {currentInnings.required_rate != null &&
              currentInnings.required_rate > 0 && (
                <span className="text-[11px] font-medium text-secondary">
                  RRR: {formatRunRate(currentInnings.required_rate)}
                </span>
              )}
            {currentInnings.target != null && currentInnings.target > 0 && (
              <span className="text-[11px] text-muted-foreground ml-auto">
                Target: {currentInnings.target}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 border-t border-border/50 px-4 py-2.5">
          {match.status === "upcoming" ? (
            <div className="flex items-center gap-3 text-xs min-w-0">
              {startTime && (
                <span className="flex items-center gap-1 shrink-0 font-medium text-primary">
                  <Clock className="h-3 w-3" />
                  {formatDateTimeIST(startTime)}
                </span>
              )}
              <span className="flex items-center gap-1 text-muted-foreground truncate">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="truncate">{match.venue}</span>
              </span>
            </div>
          ) : match.result_text ? (
            <p
              className={cn(
                "text-xs font-medium truncate",
                live ? "text-primary" : "text-muted-foreground"
              )}
            >
              {match.result_text}
            </p>
          ) : (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{match.venue}</span>
            </div>
          )}
          <ChevronRight className="h-4 w-4 text-muted-foreground/30 shrink-0 transition-all group-hover:text-muted-foreground group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}
