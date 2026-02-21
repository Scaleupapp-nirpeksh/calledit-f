export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  total_points: number;
  correct_predictions: number;
  accuracy: number;
}

export interface LeaderboardResponse {
  type: "match" | "daily" | "season" | "competition" | "league";
  key: string;
  entries: LeaderboardEntry[];
  total_participants: number;
  my_rank: number | null;
  my_entry: LeaderboardEntry | null;
  page: number;
  limit: number;
}
