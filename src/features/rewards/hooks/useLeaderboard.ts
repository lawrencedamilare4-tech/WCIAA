import { useSupabaseQuery } from '@/shared/hooks/useSupabaseQuery';
import { getLeaderboard } from '../services/rewards-service';

export function useLeaderboard() {
  return useSupabaseQuery({
    queryKey: ['leaderboard'],
    queryBuilder: () => getLeaderboard(50),
  });
}