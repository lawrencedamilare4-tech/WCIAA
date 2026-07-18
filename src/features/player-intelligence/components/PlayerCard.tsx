import { useNavigate } from 'react-router-dom';
import type { Player } from '../types';
import { Card, CardContent } from '@/shared/components/ui/card';

export function PlayerCard({ player }: { player: Player }) {
  const navigate = useNavigate();

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate(`/players/${player.id}`)}
    >
      <CardContent className="flex items-center gap-4 p-4">
        <div className="w-10 h-10 rounded-full bg-bg-tertiary flex items-center justify-center text-sm font-bold">
          {player.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">{player.name}</p>
          <p className="text-xs text-text-secondary">{player.position} • {player.team?.name ?? '-'}</p>
        </div>
        <div className="text-right">
          <span className="font-mono text-sm font-bold">{player.stats?.goals ?? 0} ⚽</span>
        </div>
      </CardContent>
    </Card>
  );
}