import type { RawMatch, Match, Innings, RawScoreEntry } from "@/lib/types/match";

/**
 * Parse team name from inning string like "Oman Inning 1" → "Oman"
 */
function parseTeamFromInning(inning: string): string {
  return inning.replace(/\s+Inning\s+\d+$/i, "").trim();
}

/**
 * Convert raw `score` entries to normalized `Innings` array.
 */
function scoreToInnings(
  scoreEntries: RawScoreEntry[],
  team1: string,
  team2: string
): Innings[] {
  return scoreEntries.map((entry, idx) => {
    const battingTeam = parseTeamFromInning(entry.inning);
    const bowlingTeam =
      battingTeam.toLowerCase() === team1.toLowerCase() ? team2 : team1;

    return {
      innings_number: idx + 1,
      batting_team: battingTeam,
      bowling_team: bowlingTeam,
      score: entry.r,
      wickets: entry.w,
      overs: entry.o,
      run_rate: entry.o > 0 ? Math.round((entry.r / entry.o) * 100) / 100 : 0,
    };
  });
}

/**
 * Normalize a raw API match into the shape all components expect.
 * If `innings` is empty but `score` exists, converts score → innings.
 */
export function normalizeMatch(raw: RawMatch): Match {
  let innings = raw.innings;

  // If innings is empty/missing but score array exists, convert
  if ((!innings || innings.length === 0) && raw.score && raw.score.length > 0) {
    innings = scoreToInnings(raw.score, raw.team1, raw.team2);
  }

  // Normalize toss_winner casing to match team names
  let tossWinner = raw.toss_winner;
  if (tossWinner) {
    if (tossWinner.toLowerCase() === raw.team1.toLowerCase()) {
      tossWinner = raw.team1;
    } else if (tossWinner.toLowerCase() === raw.team2.toLowerCase()) {
      tossWinner = raw.team2;
    }
  }

  return {
    id: raw.id,
    cricapi_id: raw.cricapi_id,
    name: raw.name,
    match_type: raw.match_type,
    status: raw.status,
    venue: raw.venue,
    date: raw.date,
    team1: raw.team1,
    team2: raw.team2,
    team1_code: raw.team1_code,
    team2_code: raw.team2_code,
    team1_img: raw.team1_img,
    team2_img: raw.team2_img,
    toss_winner: tossWinner,
    toss_decision: raw.toss_decision,
    innings,
    winner: raw.winner,
    result_text: raw.result_text,
    competition_id: raw.competition_id,
    ai_preview: raw.ai_preview,
    prediction_window_open: raw.prediction_window_open,
    current_innings: raw.current_innings,
    current_over: raw.current_over,
    current_ball: raw.current_ball,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
  };
}

/**
 * Normalize an array of raw matches.
 */
export function normalizeMatches(rawMatches: RawMatch[]): Match[] {
  return rawMatches.map(normalizeMatch);
}
