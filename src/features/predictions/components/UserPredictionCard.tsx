// src/features/predictions/components/UserPredictionForm.tsx
import { useState, useEffect } from 'react';
import { useSubmitPrediction } from '../hooks/useSubmitPrediction';
import type { PredictionRow } from '../types';
import { Button } from '../../../shared/components/ui/button';
import { Input } from '../../../shared/components/ui/Input';
import { useWalletUser } from '@/features/auth/components/WalletUserProvider';

interface Props {
  matchId: string;
  existingPrediction: PredictionRow | null;
}

export function UserPredictionForm({ matchId, existingPrediction }: Props) {
  const [homeScore, setHomeScore] = useState<number>(existingPrediction?.predicted_home_score ?? 0);
  const [awayScore, setAwayScore] = useState<number>(existingPrediction?.predicted_away_score ?? 0);
  const mutation = useSubmitPrediction(matchId);
  const { user } = useWalletUser();

  useEffect(() => {
    setHomeScore(existingPrediction?.predicted_home_score ?? 0);
    setAwayScore(existingPrediction?.predicted_away_score ?? 0);
  }, [existingPrediction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ home: homeScore, away: awayScore });
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <Input
        type="number"
        min={0}
        value={homeScore}
        onChange={(e) => setHomeScore(Number(e.target.value))}
        className="w-16 h-8 text-center text-sm"
        placeholder="0"
      />
      <span className="text-text-tertiary">-</span>
      <Input
        type="number"
        min={0}
        value={awayScore}
        onChange={(e) => setAwayScore(Number(e.target.value))}
        className="w-16 h-8 text-center text-sm"
        placeholder="0"
      />
      {user &&
      <Button className='text-black' type="submit" size="sm" disabled={mutation.isPending}>
        {mutation.isPending ? 'Saving...' : 'Save'}
      </Button> }
    </form>
  );
}