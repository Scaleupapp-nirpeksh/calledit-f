export const MATCH_STATUSES = [
  "upcoming",
  "toss",
  "live_1st",
  "innings_break",
  "live_2nd",
  "completed",
  "abandoned",
] as const;
export type MatchStatus = (typeof MATCH_STATUSES)[number];

export const BALL_OUTCOMES = [
  "dot",
  "1",
  "2",
  "3",
  "4",
  "6",
  "wicket",
] as const;
export type BallOutcome = (typeof BALL_OUTCOMES)[number];

export const PREDICTION_TYPES = [
  "ball",
  "over",
  "milestone",
  "match_winner",
] as const;
export type PredictionType = (typeof PREDICTION_TYPES)[number];

export const MILESTONE_TYPES = [
  "batter_50",
  "batter_100",
  "bowler_3w",
  "bowler_5w",
  "team_200",
] as const;
export type MilestoneType = (typeof MILESTONE_TYPES)[number];

export const BADGE_IDS = [
  "first_prediction",
  "streak_5",
  "streak_10",
  "century",
  "clutch_master",
  "match_winner_3",
  "league_creator",
  "social_sharer",
  "referral_1",
  "matches_10",
  "matches_50",
  "top_10",
] as const;
export type BadgeId = (typeof BADGE_IDS)[number];

export const IPL_TEAMS = {
  CSK: "Chennai Super Kings",
  MI: "Mumbai Indians",
  RCB: "Royal Challengers Bengaluru",
  KKR: "Kolkata Knight Riders",
  DC: "Delhi Capitals",
  PBKS: "Punjab Kings",
  RR: "Rajasthan Royals",
  SRH: "Sunrisers Hyderabad",
  GT: "Gujarat Titans",
  LSG: "Lucknow Super Giants",
} as const;
export type TeamCode = keyof typeof IPL_TEAMS;
