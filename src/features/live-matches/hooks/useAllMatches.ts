// src/features/live-matches/hooks/useAllMatches.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/shared/lib/supabase';

export function useAllMatches(competition?: string) {
  return useQuery({
    queryKey: ['matches', 'all', competition],
    queryFn: async () => {
      let builder = supabase
        .from('matches')
        .select('*, home_team:teams!matches_home_team_id_fkey(name, flag), away_team:teams!matches_away_team_id_fkey(name, flag)')
        .order('kickoff_time', { ascending: false });   // latest first

      if (competition) {
        builder = builder.eq('competition', competition);
      }

      const { data, error } = await builder;
      if (error) throw error;
      return data ?? [];
    },
  });
}