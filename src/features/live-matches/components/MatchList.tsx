// src/features/live-matches/components/MatchList.tsx
import { Card } from '@/shared/components/ui/card';
import { Skeleton } from '../../../shared/components/ui/skeleton';
import { MatchCard } from './MatchCard';

interface Props {
  matches: any[];
  isLoading: boolean;
  error: Error | null;
}

export function MatchList({ matches, isLoading, error }: Props) {
  if (error) {
    return (
      <Card className="p-6 text-center text-danger">
        Failed to load matches.
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <Card className="p-6 text-center text-text-secondary">
        No live or upcoming matches.
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  );
}