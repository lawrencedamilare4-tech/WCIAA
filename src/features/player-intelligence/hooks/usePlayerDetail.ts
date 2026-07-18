import { useSupabaseQuery } from '@/shared/hooks/useSupabaseQuery';
import { getPlayerDetail } from '../services/player-service';

export function usePlayerDetail(playerId: string | undefined) {
  return useSupabaseQuery({
    queryKey: ['player', playerId],
    queryBuilder: () => getPlayerDetail(playerId!),
    enabled: !!playerId,
  });
}