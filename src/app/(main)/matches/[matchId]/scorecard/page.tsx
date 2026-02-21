"use client";

import { use, useState } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BattingTable } from "@/components/match/batting-table";
import { BowlingTable } from "@/components/match/bowling-table";
import { TeamBadge } from "@/components/match/team-badge";
import { useMatch, useScorecard } from "@/lib/queries/matches";
import { formatScore } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

function parseTeamName(inningStr: string): string {
  return inningStr.replace(/\s+Inning\s+\d+$/i, "").trim();
}

export default function ScorecardPage({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const { matchId } = use(params);
  const { data: match } = useMatch(matchId);
  const { data: scorecard, isLoading } = useScorecard(matchId);
  const [activeInnings, setActiveInnings] = useState("0");

  if (isLoading || !scorecard || !match) {
    return (
      <>
        <TopBar title="Scorecard" showBack />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </>
    );
  }

  const detailedInnings = scorecard.detailed_scorecard ?? [];

  function getTeamInfo(inningStr: string): {
    code: string;
    img: string | null | undefined;
  } {
    const teamName = parseTeamName(inningStr);
    if (teamName.toLowerCase() === match!.team1.toLowerCase())
      return { code: match!.team1_code, img: scorecard!.team1_img ?? match!.team1_img };
    if (teamName.toLowerCase() === match!.team2.toLowerCase())
      return { code: match!.team2_code, img: scorecard!.team2_img ?? match!.team2_img };
    return { code: teamName.slice(0, 3).toUpperCase(), img: null };
  }

  if (detailedInnings.length === 0) {
    return (
      <>
        <TopBar
          title={`${match.team1_code} vs ${match.team2_code} — Scorecard`}
          showBack
        />
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-muted-foreground">
            Scorecard not available yet
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar
        title={`${match.team1_code} vs ${match.team2_code} — Scorecard`}
        showBack
      />

      <main className="mx-auto max-w-2xl p-4">
        {/* Innings Summary */}
        <div className="mb-4 space-y-2">
          {scorecard.innings.map((inn) => {
            const isTeam1 =
              inn.batting_team.toLowerCase() === match.team1.toLowerCase();
            const teamCode = isTeam1 ? match.team1_code : match.team2_code;
            const teamImg = isTeam1
              ? scorecard.team1_img ?? match.team1_img
              : scorecard.team2_img ?? match.team2_img;

            return (
              <div
                key={inn.innings_number}
                className="flex items-center justify-between rounded-lg border border-border bg-card p-3"
              >
                <div className="flex items-center gap-2">
                  <TeamBadge code={teamCode} imgUrl={teamImg} size="md" />
                  <span className="text-sm font-medium">
                    {inn.batting_team}
                  </span>
                </div>
                <span className="text-sm font-bold tabular-nums">
                  {formatScore(inn.score, inn.wickets, inn.overs)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Result */}
        {match.result_text && (
          <p className="mb-4 text-center text-sm font-medium text-primary">
            {match.result_text}
          </p>
        )}

        {/* Detailed Scorecard Tabs */}
        <Tabs value={activeInnings} onValueChange={setActiveInnings}>
          <TabsList
            className={cn(
              "grid w-full",
              detailedInnings.length === 1 ? "grid-cols-1" : "grid-cols-2"
            )}
          >
            {detailedInnings.map((inn, idx) => (
              <TabsTrigger key={idx} value={String(idx)}>
                {getTeamInfo(inn.inning).code} Innings
              </TabsTrigger>
            ))}
          </TabsList>

          {detailedInnings.map((inn, idx) => {
            const team = getTeamInfo(inn.inning);

            return (
              <TabsContent key={idx} value={String(idx)} className="mt-4">
                <div className="space-y-6">
                  {/* Batting */}
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <TeamBadge
                        code={team.code}
                        imgUrl={team.img}
                        size="sm"
                      />
                      <h3 className="text-sm font-semibold">Batting</h3>
                    </div>
                    <BattingTable batsmen={inn.batting} />
                  </div>

                  {/* Bowling */}
                  {inn.bowling.length > 0 && (
                    <div>
                      <h3 className="mb-3 text-sm font-semibold">Bowling</h3>
                      <BowlingTable bowlers={inn.bowling} />
                    </div>
                  )}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </main>
    </>
  );
}
