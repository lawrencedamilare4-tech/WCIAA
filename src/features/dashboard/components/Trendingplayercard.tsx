// src/features/dashboard/components/TrendingPlayerCard.tsx
import { Card } from '@/shared/components/ui/card';

interface Props {
  player: any;
}

export function TrendingPlayerCard({ player }: Props) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-bg-tertiary flex items-center justify-center text-xs font-bold">
        {player.name.charAt(0)}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{player.name}</p>
        <p className="text-xs text-text-secondary">{player.position}</p>
      </div>
      <span className="text-sm font-mono font-semibold">{player.stats?.goals ?? 0} ⚽</span>
    </div>
  );
}