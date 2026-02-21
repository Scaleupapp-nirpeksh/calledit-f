import type { MatchStatus } from "@/lib/types/constants";
import type { Match } from "@/lib/types/match";

/**
 * Format overs display: 15.3 → "15.3", 20.0 → "20.0"
 */
export function formatOvers(overs: number): string {
  return overs.toFixed(1);
}

/**
 * Format score: "145/3 (15.3)"
 */
export function formatScore(
  score: number,
  wickets: number,
  overs: number
): string {
  return `${score}/${wickets} (${formatOvers(overs)})`;
}

/**
 * Format run rate to 2 decimal places
 */
export function formatRunRate(rate: number): string {
  return rate.toFixed(2);
}

const IST = "Asia/Kolkata";

/**
 * Check if a date string contains time information.
 * Date-only strings like "2026-02-20" don't have time.
 */
function hasTimeInfo(dateStr: string): boolean {
  return dateStr.includes("T") || dateStr.includes(":");
}

/**
 * Format match date in IST.
 * - With time: "26 Mar, 7:30 PM IST"
 * - Date-only: "26 Mar"
 */
export function formatMatchDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (hasTimeInfo(dateStr)) {
    return (
      date.toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: IST,
      }) + " IST"
    );
  }
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    timeZone: IST,
  });
}

/**
 * Format a date in IST (date only): "26 Mar 2026"
 */
export function formatDateIST(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: IST,
  });
}

/**
 * Format time only in IST: "7:30 PM IST"
 * Returns empty string for date-only strings.
 */
export function formatTimeIST(dateStr: string): string {
  if (!hasTimeInfo(dateStr)) return "";
  return (
    new Date(dateStr).toLocaleString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: IST,
    }) + " IST"
  );
}

/**
 * Format relative time: "2h ago", "in 3h"
 * Shows IST date for items more than a week away.
 */
export function formatRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = date.getTime() - now.getTime();
  const diffMins = Math.round(diffMs / 60000);
  const absMins = Math.abs(diffMins);

  if (absMins < 1) return "now";
  if (absMins < 60) {
    return diffMins > 0 ? `in ${absMins}m` : `${absMins}m ago`;
  }
  const hours = Math.round(absMins / 60);
  if (hours < 24) {
    return diffMins > 0 ? `in ${hours}h` : `${hours}h ago`;
  }
  const days = Math.round(hours / 24);
  if (days <= 7) {
    return diffMins > 0 ? `in ${days}d` : `${days}d ago`;
  }
  return formatMatchDate(dateStr);
}

/**
 * Human-readable match status
 */
export function formatMatchStatus(status: MatchStatus): string {
  const labels: Record<MatchStatus, string> = {
    upcoming: "Upcoming",
    toss: "Toss",
    live_1st: "1st Innings",
    innings_break: "Innings Break",
    live_2nd: "2nd Innings",
    completed: "Completed",
    abandoned: "Abandoned",
  };
  return labels[status];
}

/**
 * Check if a match is currently live
 */
export function isLiveStatus(status: MatchStatus): boolean {
  return ["live_1st", "live_2nd", "innings_break", "toss"].includes(status);
}

/**
 * Sort matches by date. "asc" = earliest first, "desc" = latest first.
 */
export function sortMatchesByDate(
  matches: Match[],
  order: "asc" | "desc"
): Match[] {
  return [...matches].sort((a, b) => {
    const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
    return order === "asc" ? diff : -diff;
  });
}

/**
 * Format large numbers: 1234 → "1.2K"
 */
export function formatCompactNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

/**
 * Parse start time from backend result_text for upcoming matches.
 * Backend sends: "Match starts at Feb 22, 13:30 GMT"
 * Returns a Date object in UTC, or null if unparseable.
 */
export function parseStartTimeFromResultText(
  resultText: string | null,
  dateStr: string
): Date | null {
  if (!resultText) return null;
  const m = resultText.match(/(\w+)\s+(\d+),?\s+(\d+):(\d+)\s+GMT/);
  if (!m) return null;

  const year =
    new Date(dateStr).getFullYear() || new Date().getFullYear();
  // Build an ISO-ish string: "Feb 22, 2026 13:30 GMT"
  const dateTimeStr = `${m[1]} ${m[2]}, ${year} ${m[3]}:${m[4]} GMT`;
  const date = new Date(dateTimeStr);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Get the best available start time for a match.
 * Prefers the `date` field if it has time info, falls back to parsing result_text.
 */
export function getMatchStartTime(match: Match): Date | null {
  if (hasTimeInfo(match.date)) return new Date(match.date);
  return parseStartTimeFromResultText(match.result_text, match.date);
}

/**
 * Format a Date in IST: "22 Feb, 7:00 pm IST"
 */
export function formatDateTimeIST(date: Date): string {
  return (
    date.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: IST,
    }) + " IST"
  );
}

/**
 * Format a countdown string: "in 5h 30m", "in 45m", "in 2d"
 * Returns null if the date is in the past.
 */
export function formatCountdown(target: Date): string | null {
  const diffMs = target.getTime() - Date.now();
  if (diffMs <= 0) return null;

  const totalMins = Math.floor(diffMs / 60000);
  if (totalMins < 1) return "starting now";
  if (totalMins < 60) return `in ${totalMins}m`;

  const hours = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  if (hours < 24) {
    return mins > 0 ? `in ${hours}h ${mins}m` : `in ${hours}h`;
  }

  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  if (days <= 7) {
    return remainingHours > 0
      ? `in ${days}d ${remainingHours}h`
      : `in ${days}d`;
  }

  return null; // Too far away — caller should show date instead
}
