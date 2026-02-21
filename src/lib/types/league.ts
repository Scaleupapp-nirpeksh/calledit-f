export interface LeagueMember {
  user_id: string;
  username?: string;
  display_name?: string;
  avatar_url?: string | null;
  total_points?: number;
  rank?: number;
  joined_at: string;
}

export interface League {
  id: string;
  name: string;
  invite_code: string;
  owner_id: string;
  competition_id: string | null;
  members: LeagueMember[];
  member_count: number;
  max_members: number;
  created_at: string;
  updated_at: string;
}

export interface CreateLeaguePayload {
  name: string;
  competition_id?: string;
}

export interface JoinLeaguePayload {
  invite_code: string;
}

export interface LeagueListResponse {
  leagues: League[];
  total: number;
}
