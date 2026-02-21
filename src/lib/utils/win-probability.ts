/**
 * Simple cricket win probability estimator.
 * Uses innings context (target, wickets, overs, run rate) to estimate
 * each team's win probability as a percentage.
 */

import type { Match } from "@/lib/types/match";

export interface WinProbability {
  team1: number; // 0–100
  team2: number; // 0–100
  draw: number; // 0–100 (for tests)
}

/**
 * Estimate win probabilities from current match state.
 * Returns { team1, team2, draw } as percentages summing to ~100.
 */
export function estimateWinProbability(match: Match): WinProbability | null {
  if (!match.innings.length || match.status === "upcoming") return null;

  // If match is completed, return actuals
  if (match.status === "completed") {
    if (match.winner === match.team1) return { team1: 100, team2: 0, draw: 0 };
    if (match.winner === match.team2) return { team1: 0, team2: 100, draw: 0 };
    return { team1: 0, team2: 0, draw: 100 };
  }

  const inn1 = match.innings.find((i) => i.innings_number === 1);
  const inn2 = match.innings.find((i) => i.innings_number === 2);

  // First innings in progress — use wickets & run rate to estimate strength
  if (match.current_innings === 1 && inn1) {
    const oversBowled = inn1.overs || 0;
    const wicketsLost = inn1.wickets || 0;
    const runRate = inn1.run_rate || 0;

    // Batting team advantage based on run rate and wickets
    const rrFactor = Math.min(runRate / 8, 1.5); // Higher run rate = better for batting team
    const wicketPenalty = wicketsLost * 5; // Each wicket reduces batting advantage

    const battingTeamPct = Math.min(
      75,
      Math.max(25, 50 + rrFactor * 10 - wicketPenalty + oversBowled * 0.2)
    );

    // Batting team in first innings = team batting first
    const isBattingTeam1 =
      inn1.batting_team.toLowerCase().includes(match.team1_code.toLowerCase()) ||
      match.team1.toLowerCase().includes(inn1.batting_team.toLowerCase().split(" ")[0]);

    return isBattingTeam1
      ? { team1: Math.round(battingTeamPct), team2: Math.round(100 - battingTeamPct), draw: 0 }
      : { team1: Math.round(100 - battingTeamPct), team2: Math.round(battingTeamPct), draw: 0 };
  }

  // Second innings — chase situation
  if (match.current_innings === 2 && inn1 && inn2) {
    const target = inn1.score + 1;
    const currentScore = inn2.score || 0;
    const wicketsLost = inn2.wickets || 0;
    const oversBowled = inn2.overs || 0;
    const totalOvers = 20; // Default T20; could derive from match_type

    const runsNeeded = target - currentScore;
    const oversRemaining = Math.max(0.1, totalOvers - oversBowled);
    const requiredRate = runsNeeded / oversRemaining;
    const currentRate = inn2.run_rate || 0;

    // Chase probability based on: required rate vs current rate, wickets in hand
    const rrRatio = currentRate > 0 ? requiredRate / currentRate : 2;
    const wicketsInHand = 10 - wicketsLost;

    let chasePct: number;

    if (runsNeeded <= 0) {
      chasePct = 100; // Already won
    } else if (wicketsLost >= 10) {
      chasePct = 0; // All out
    } else {
      // Base: if required rate = current rate and plenty of wickets, 50-50
      chasePct = 50;
      // Adjust for run rate ratio (higher required = harder to chase)
      chasePct -= (rrRatio - 1) * 20;
      // Adjust for wickets in hand
      chasePct += (wicketsInHand - 5) * 3;
      // Adjust for progress: closer to target = more confident
      const progressPct = currentScore / target;
      chasePct += progressPct * 15;
      // Clamp
      chasePct = Math.min(95, Math.max(5, chasePct));
    }

    // Chasing team
    const isChasingTeam1 =
      inn2.batting_team.toLowerCase().includes(match.team1_code.toLowerCase()) ||
      match.team1.toLowerCase().includes(inn2.batting_team.toLowerCase().split(" ")[0]);

    return isChasingTeam1
      ? { team1: Math.round(chasePct), team2: Math.round(100 - chasePct), draw: 0 }
      : { team1: Math.round(100 - chasePct), team2: Math.round(chasePct), draw: 0 };
  }

  return { team1: 50, team2: 50, draw: 0 };
}
