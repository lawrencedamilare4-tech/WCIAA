export type TournamentStanding = {
  id: string;
  group: string;
  position: number;
  team: { name: string; flag?: string | null } | null;
  played: number;
  won: number;
  draw: number;
  lost: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
  points: number;
};

export type TournamentBracketMatch = {
  id: string;
  stage: string;
  home_team: { name: string } | null;
  away_team: { name: string } | null;
  home_score: number | null;
  away_score: number | null;
};

export type TournamentAIReport = {
  id: string;
  type: string;
  content: string;
  created_at: string;
};
