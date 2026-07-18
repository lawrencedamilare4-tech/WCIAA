import { useSupabaseQuery } from '@/shared/hooks/useSupabaseQuery';
import { getPointsHistory } from '../services/rewards-service';
import { useWalletUser } from '@/features/auth/components/WalletUserProvider';

export function usePointsHistory() {
  const { user } = useWalletUser();
  return useSupabaseQuery({
    queryKey: ['points-history', user?.id],
    queryBuilder: () => getPointsHistory(user!.id),
    enabled: !!user,
  });
}