import type { BadgeId } from "./constants";

export interface UserStats {
  total_predictions: number;
  correct_predictions: number;
  accuracy: number;
  total_points: number;
  current_streak: number;
  best_streak: number;
  matches_played: number;
  clutch_correct: number;
  match_winners_correct: number;
}

export interface User {
  id: string;
  phone_masked: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  favourite_team: string | null;
  favourite_players: string[];
  referral_code: string;
  stats: UserStats;
  badges: BadgeId[];
  is_onboarded: boolean;
  created_at: string;
  updated_at: string;
}

export interface OnboardingPayload {
  username: string;
  display_name: string;
  favourite_team?: string;
  favourite_players?: string[];
  referral_code_used?: string;
}

export interface UpdateProfilePayload {
  username?: string;
  display_name?: string;
  avatar_url?: string;
  favourite_team?: string;
  favourite_players?: string[];
}
