import { IPL_TEAMS, type TeamCode } from "@/lib/types/constants";

/**
 * Team primary + accent colors for UI styling.
 * Key = team code, value = { bg, text, border, accent }
 */
const TEAM_COLORS: Record<
  TeamCode,
  { bg: string; text: string; border: string; accent: string }
> = {
  CSK: {
    bg: "bg-yellow-500/15",
    text: "text-yellow-400",
    border: "border-yellow-500/40",
    accent: "#facc15",
  },
  MI: {
    bg: "bg-blue-500/15",
    text: "text-blue-400",
    border: "border-blue-500/40",
    accent: "#3b82f6",
  },
  RCB: {
    bg: "bg-red-500/15",
    text: "text-red-400",
    border: "border-red-500/40",
    accent: "#ef4444",
  },
  KKR: {
    bg: "bg-purple-500/15",
    text: "text-purple-400",
    border: "border-purple-500/40",
    accent: "#a855f7",
  },
  DC: {
    bg: "bg-blue-600/15",
    text: "text-blue-300",
    border: "border-blue-600/40",
    accent: "#2563eb",
  },
  PBKS: {
    bg: "bg-red-600/15",
    text: "text-red-300",
    border: "border-red-600/40",
    accent: "#dc2626",
  },
  RR: {
    bg: "bg-pink-500/15",
    text: "text-pink-400",
    border: "border-pink-500/40",
    accent: "#ec4899",
  },
  SRH: {
    bg: "bg-orange-500/15",
    text: "text-orange-400",
    border: "border-orange-500/40",
    accent: "#f97316",
  },
  GT: {
    bg: "bg-cyan-500/15",
    text: "text-cyan-400",
    border: "border-cyan-500/40",
    accent: "#06b6d4",
  },
  LSG: {
    bg: "bg-sky-500/15",
    text: "text-sky-400",
    border: "border-sky-500/40",
    accent: "#0ea5e9",
  },
};

/**
 * Default colors for teams not in the IPL map.
 */
const DEFAULT_COLORS = {
  bg: "bg-muted",
  text: "text-muted-foreground",
  border: "border-border",
  accent: "#6b7280",
};

/**
 * Get team display colors by team code.
 */
export function getTeamColors(teamCode: string) {
  return TEAM_COLORS[teamCode as TeamCode] ?? DEFAULT_COLORS;
}

/**
 * Get full team name from code. Falls back to the code itself.
 */
export function getTeamName(teamCode: string): string {
  return IPL_TEAMS[teamCode as TeamCode] ?? teamCode;
}

/**
 * Get team code from full team name. Falls back to first 3 chars uppercased.
 */
export function getTeamCode(teamName: string): string {
  const entry = Object.entries(IPL_TEAMS).find(
    ([, name]) => name === teamName
  );
  return entry ? entry[0] : teamName.slice(0, 3).toUpperCase();
}
