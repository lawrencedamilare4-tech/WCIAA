import { useSupabaseQuery } from '@/shared/hooks/useSupabaseQuery';
import { getUserPoints } from '../services/rewards-service';
import { useWalletUser } from '@/features/auth/components/WalletUserProvider';

export function useRewards() {
  const { user } = useWalletUser();
  return useSupabaseQuery({
    queryKey: ['rewards', user?.id],
    queryBuilder: () => getUserPoints(user!.id),
    enabled: !!user,
  });
}