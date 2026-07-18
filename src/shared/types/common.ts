export interface Team {
  id: string;
  name: string;
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
}
