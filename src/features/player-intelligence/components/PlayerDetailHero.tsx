import { Card, CardContent } from '@/shared/components/ui/card';
import type { Player } from '../types';

export function PlayerDetailHero({ player }: { player: Player }) {
  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-bg-tertiary flex items-center justify-center text-3xl font-bold">
          {player.name.charAt(0)}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{player.name}</h1>
          <p className="text-text-secondary">
            {player.position} • {player.team?.name ?? 'Free Agent'}
          </p>
          <div className="flex gap-6 mt-2 text-sm">
            <div>
              <span className="text-text-tertiary">Age</span>
              <p className="font-semibold">
                {player.date_of_birth
                  ? new Date().getFullYear() - new Date(player.date_of_birth).getFullYear()
                  : '-'}
              </p>
            </div>
            <div>
              <span className="text-text-tertiary">Caps</span>
              <p className="font-semibold">{player.stats?.caps ?? 0}</p>
            </div>
            <div>
              <span className="text-text-tertiary">Goals</span>
              <p className="font-semibold">{player.stats?.goals ?? 0}</p>
            </div>
          </div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-brand">
            {player.stats?.rating ? Number(player.stats.rating).toFixed(1) : '-'}
          </div>
          <span className="text-xs text-text-tertiary">AI Rating</span>
        </div>
      </div>
    </Card>
  );
}