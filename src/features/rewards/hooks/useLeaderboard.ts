// src/features/rewards/hooks/useLeaderboard.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/shared/lib/supabase';

export function useLeaderboard() {
  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('wallet_address, username, full_name, points')
        .order('points', { ascending: false })
        .limit(50);
      if (error) throw error;

      return (data ?? []).map((entry, idx) => ({
        id: entry.wallet_address,
        username: entry.username,
        full_name: entry.full_name,
        points: entry.points,
        rank: idx + 1,
      }));
    },
    staleTime: 120_000,
  });
}