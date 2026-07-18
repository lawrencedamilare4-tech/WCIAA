import { useSupabaseQuery } from '@/shared/hooks/useSupabaseQuery';
import { getPlayerAIAnalysis } from '../services/player-service';

export function usePlayerAIAnalysis(playerId: string | undefined) {
  return useSupabaseQuery({
    queryKey: ['ai-report', 'player', playerId],
    queryBuilder: () => getPlayerAIAnalysis(playerId!),
    enabled: !!playerId,
  });
}