// src/features/predictions/components/PredictionList.tsx
import { PredictionCard } from './PredictionCard';
import { UpsetAlertCard } from './UpsetAlertCard';
import { Skeleton } from '@/shared/components/ui/skeleton';
import type { MatchWithTeams, PredictionRow } from '../types';

interface Props {
  matches: MatchWithTeams[];
  aiPredictions: PredictionRow[];
  userPredictions: PredictionRow[];
  isLoading: boolean;
  error: Error | null;
}

export function PredictionList({ matches, aiPredictions, userPredictions, isLoading, error }: Props) {
  if (error) return <div className="text-danger">Failed to load predictions.</div>;
  if (isLoading) return <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40" />)}</div>;
  if (matches.length === 0) return <div className="text-text-secondary">No upcoming matches to predict.</div>;

  // Separate upset alerts
  const upsets = matches.filter((m) => {
    const pred = aiPredictions.find((p) => p.match_id === m.id);
    return pred?.upset_alert;
  });

  return (
    <div className="space-y-4">
      {upsets.map((match) => (
        <UpsetAlertCard
          key={match.id}
          match={match}
          aiPrediction={aiPredictions.find((p) => p.match_id === match.id)}
        />
      ))}
      {matches.map((match) => (
        <PredictionCard
          key={match.id}
          match={match}
          aiPrediction={aiPredictions.find((p) => p.match_id === match.id) ?? null}
          userPrediction={userPredictions.find((p) => p.match_id === match.id) ?? null}
        />
      ))}
    </div>
  );
}