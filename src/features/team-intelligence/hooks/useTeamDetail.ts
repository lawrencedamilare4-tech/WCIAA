// src/features/team-intelligence/hooks/useTeamDetail.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/shared/lib/supabase';

export function useTeamDetail(teamId: string | undefined) {
  return useQuery({
    queryKey: ['team', teamId],
    queryFn: async () => {
      if (!teamId) return null;   // guard: no ID means we return null immediately

      // 1. Fetch the team
      const { data: team, error } = await supabase
        .from('teams')
        .select('*')
        .eq('id', teamId)
        .single();

      if (error) throw error;
      if (!team) throw new Error('Team not found');

      // 2. Fetch standing (optional – might not exist)
      const { data: standing } = await supabase
        .from('standings')
        .select('*')
        .eq('team_id', teamId)
        .maybeSingle();

      // 3. Fetch players
      const { data: players } = await supabase
        .from('players')
        .select('*')
        .eq('team_id', teamId)
        .order('jersey_number', { ascending: true });

      // Always return a consistent object – never undefined
      return {
        team,
        standing: standing ?? null,
        players: players ?? [],
      };
    },
    enabled: !!teamId,
    // Throw errors so TanStack Query can catch them
    retry: 1,
  });
}