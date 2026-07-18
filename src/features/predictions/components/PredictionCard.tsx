// src/features/predictions/components/PredictionCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { ConfidenceBar } from './ConfidenceBar';
import { Badge } from '@/shared/components/ui/badge';
import dayjs from 'dayjs';
import type { MatchWithTeams, PredictionRow } from '../types';
import { UserPredictionForm } from './UserPredictionCard';

interface Props {
  match: MatchWithTeams;
  aiPrediction: PredictionRow | null;
  userPrediction: PredictionRow | null;
}

export function PredictionCard({ match, aiPrediction, userPrediction }: Props) {
  const confidence = aiPrediction?.confidence ?? 0;
  const winner = aiPrediction?.result;
  const upset = aiPrediction?.upset_alert ?? false;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-semibold">{match.home_team?.name}</span>
            <span className="text-text-tertiary">vs</span>
            <span className="font-semibold">{match.away_team?.name}</span>
          </div>
          <div className="flex items-center gap-2">
            {upset && <Badge variant="warning">Upset Alert</Badge>}
            <Badge variant="default">{dayjs(match.kickoff_time).format('MMM D, HH:mm')}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* AI Prediction */}
        <div>
          <p className="text-xs text-black mb-1">AI Prediction</p>
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold">
              {winner === 'home' ? match.home_team?.name : winner === 'away' ? match.away_team?.name : 'Draw'}
            </span>
            <ConfidenceBar value={confidence} />
            <span className="text-sm font-mono text-text-secondary">{Math.round(confidence * 100)}%</span>
          </div>
          {aiPrediction?.next_goal_probability !== undefined && (
            <p className="text-xs text-text-tertiary mt-1">
              Next goal probability: {Math.round(aiPrediction.next_goal_probability * 100)}%
            </p>
          )}
        </div>

        {/* User Prediction */}
        <div>
          <p className="text-xs text-text-secondary mb-2">Your Prediction</p>
          <UserPredictionForm
            matchId={match.id}
            existingPrediction={userPrediction}
          />
        </div>
      </CardContent>
    </Card>
  );
}