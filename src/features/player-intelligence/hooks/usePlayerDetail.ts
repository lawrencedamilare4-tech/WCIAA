// src/features/player-intelligence/hooks/usePlayerDetail.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/shared/lib/supabase';

export function usePlayerDetail(playerId: string | undefined) {
  return useQuery({
    queryKey: ['player', playerId],
    queryFn: async () => {
      if (!playerId) return null;   // guard: no ID → return null immediately

      // Fetch player with team info
      const { data: player, error } = await supabase
        .from('players')
        .select('*, team:teams(name, flag)')
        .eq('id', playerId)
        .single();

      if (error) throw error;
      if (!player) throw new Error('Player not found');

      return player;   // now guaranteed to be a valid object, never undefined
    },
    enabled: !!playerId,
    retry: 1,
  });
}