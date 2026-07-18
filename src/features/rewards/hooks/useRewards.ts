// src/features/rewards/hooks/useRewards.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/shared/lib/supabase';

export function useRewards(walletAddress?: string) {
  return useQuery({
    queryKey: ['rewards', walletAddress],
    queryFn: async () => {
      if (!walletAddress) return { points: 0, rank: 0 };

      // Get points from profile (or wallet_connections -> profiles)
      const { data: profile } = await supabase
        .from('profiles')
        .select('points')
        .eq('wallet_address', walletAddress)
        .single();

      const points = profile?.points ?? 0;

      // Count how many wallets have more points (rank)
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gt('points', points);

      return {
        points,
        rank: (count ?? 0) + 1,
      };
    },
    enabled: !!walletAddress,
    staleTime: 60_000, // refresh every minute
  });
}