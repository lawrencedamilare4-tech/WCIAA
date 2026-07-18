import { Card, CardContent } from '@/shared/components/ui/card';
import type { Team, Standing } from '../types';

interface Props {
  team: Team;
  standing: Standing | null;
}

export function TeamDetailHero({ team, standing }: Props) {
  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-bg-tertiary flex items-center justify-center text-3xl">
          {team.flag ? <img src={team.flag} alt={team.name} className="w-full h-full object-cover" /> : '🏳️'}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{team.name}</h1>
          <p className="text-text-secondary text-sm">FIFA Ranking: —</p>
          {standing && (
            <div className="mt-2 flex gap-4 text-sm">
              <span>Group {standing.group_name} – {standing.position}{getOrdinal(standing.position)}</span>
              <span>P: {standing.played} W: {standing.wins} D: {standing.draws} L: {standing.losses}</span>
              <span>GF: {standing.goals_for} GA: {standing.goals_against} GD: {standing.goal_diff}</span>
              <span className="font-semibold">{standing.points} pts</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}