// RewardsHeader.tsx
import { Card, CardContent } from '@/shared/components/ui/card';
import { Trophy, Star } from 'lucide-react';

interface Props {
  points: number;
  rank: number;
}

export function RewardsHeader({ points, rank }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Card className="p-6 bg-bg-secondary border-0">
        <div className="flex items-center gap-3">
          <Star className="h-6 w-6 text-warning" />
          <div>
            <p className="text-sm text-text-secondary">Your Points</p>
            <p className="text-3xl font-bold font-mono">{points.toLocaleString()}</p>
          </div>
        </div>
      </Card>
      <Card className="p-6 bg-bg-secondary border-0">
        <div className="flex items-center gap-3">
          <Trophy className="h-6 w-6 text-brand" />
          <div>
            <p className="text-sm text-text-secondary">Global Rank</p>
            <p className="text-3xl font-bold font-mono">#{rank}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}