import type { BadgeId } from "@/lib/types/constants";

export interface BadgeMeta {
  name: string;
  description: string;
  icon: string;
}

export const BADGE_META: Record<BadgeId, BadgeMeta> = {
  first_prediction: {
    name: "First Call",
    description: "Made your first prediction",
    icon: "trophy",
  },
  streak_5: {
    name: "On Fire",
    description: "5 correct predictions in a row",
    icon: "fire",
  },
  streak_10: {
    name: "Unstoppable",
    description: "10 correct predictions in a row",
    icon: "lightning",
  },
  century: {
    name: "Century Maker",
    description: "Earned 100+ points in a single match",
    icon: "100",
  },
  clutch_master: {
    name: "Clutch Master",
    description: "5+ correct death over predictions",
    icon: "target",
  },
  match_winner_3: {
    name: "Oracle",
    description: "Correctly predicted 3 match winners",
    icon: "crystal_ball",
  },
  league_creator: {
    name: "League Founder",
    description: "Created a league",
    icon: "crown",
  },
  social_sharer: {
    name: "Show Off",
    description: "Shared a match card",
    icon: "share",
  },
  referral_1: {
    name: "Recruiter",
    description: "Someone used your referral code",
    icon: "handshake",
  },
  matches_10: {
    name: "Regular",
    description: "Played in 10 matches",
    icon: "calendar",
  },
  matches_50: {
    name: "Veteran",
    description: "Played in 50 matches",
    icon: "medal",
  },
  top_10: {
    name: "Elite",
    description: "Finished in top 10 of a match",
    icon: "star",
  },
};
