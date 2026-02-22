"use client";

import type { Match } from "@/lib/types/match";
import { MatchStatusBadge } from "./match-status-badge";
import { TeamBadge } from "./team-badge";
import { formatRunRate, isLiveStatus } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

interface LiveScoreHeaderProps {
  match: Match;
}

export function LiveScoreHeader({ match }: LiveScoreHeaderProps) {
  const live = isLiveStatus(match.status);
  const abandoned = match.status === "abandoned";

  const team1Innings = match.innings.find(
    (i) => i.batting_team.toLowerCase() === match.team1.toLowerCase()
  );
  const team2Innings = match.innings.find(
    (i) => i.batting_team.toLowerCase() === match.team2.toLowerCase()
  );

  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-4",
        live && "border-primary/20 shadow-[0_0_20px_rgba(var(--primary),0.08)]",
        abandoned && "border-destructive/20 opacity-70"
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <MatchStatusBadge status={match.status} />
        {match.current_over != null && match.current_ball != null && (
          <span className="text-xs font-medium text-muted-foreground tabular-nums">
            Ov {match.current_over}.{match.current_ball}
          </span>
        )}
      </div>

      <div className="space-y-3">
        {/* Team 1 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <TeamBadge
              code={match.team1_code}
              imgUrl={match.team1_img}
              size="lg"
            />
            <span
              className={cn(
                "font-medium",
                match.winner === match.team1
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {match.team1_code}
            </span>
          </div>
          {team1Innings ? (
            <div className="text-right">
              <span className="text-2xl font-bold tabular-nums">
                {team1Innings.score}/{team1Innings.wickets}
              </span>
              <span className="ml-2 text-xs text-muted-foreground tabular-nums">
                ({team1Innings.overs.toFixed(1)})
              </span>
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">Yet to bat</span>
          )}
        </div>

        {/* Team 2 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <TeamBadge
              code={match.team2_code}
              imgUrl={match.team2_img}
              size="lg"
            />
            <span
              className={cn(
                "font-medium",
                match.winner === match.team2
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {match.team2_code}
            </span>
          </div>
          {team2Innings ? (
            <div className="text-right">
              <span className="text-2xl font-bold tabular-nums">
                {team2Innings.score}/{team2Innings.wickets}
              </span>
              <span className="ml-2 text-xs text-muted-foreground tabular-nums">
                ({team2Innings.overs.toFixed(1)})
              </span>
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">Yet to bat</span>
          )}
        </div>
      </div>

      {/* Run rate / required rate info */}
      {live && (
        <div className="mt-3 flex items-center gap-4 border-t border-border pt-3 text-xs text-muted-foreground">
          {team1Innings && team1Innings.overs > 0 && (
            <span>
              CRR: <strong className="text-foreground">{formatRunRate(team1Innings.run_rate)}</strong>
            </span>
          )}
          {team2Innings && team2Innings.overs > 0 && (
            <>
              <span>
                CRR: <strong className="text-foreground">{formatRunRate(team2Innings.run_rate)}</strong>
              </span>
              {team2Innings.required_rate != null && (
                <span>
                  RRR: <strong className="text-foreground">{formatRunRate(team2Innings.required_rate)}</strong>
                </span>
              )}
              {team2Innings.target != null && (
                <span>
                  Target: <strong className="text-foreground">{team2Innings.target}</strong>
                </span>
              )}
            </>
          )}
        </div>
      )}

      {/* Result text */}
      {match.result_text && (
        <p className="mt-3 text-center text-sm font-medium text-primary">
          {match.result_text}
        </p>
      )}
    </div>
  );
}
