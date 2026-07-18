import type { Database } from '../../../shared/lib/supabase';
import { useRealtimeSubscription } from '../../../shared/hooks/useRealtimeSubscription';
import { useSupabaseQuery } from '../../../shared/hooks/useSupabaseQuery';
import { supabase } from '../../../shared/lib/supabase';

type Match = Database['public']['Tables']['matches']['Row'] & {
  home_team: { name: string; flag: string | null } | null;
  away_team: { name: string; flag: string | null } | null;
};

export function useLiveMatches(competition?: string) {
  // Build query for live + scheduled matches
  const liveQuery = useSupabaseQuery({
    queryKey: ['matches', 'live', competition],
    queryBuilder: () => {
      let builder = supabase
        .from('matches')
        .select('*, home_team:teams!matches_home_team_id_fkey(name, flag), away_team:teams!matches_away_team_id_fkey(name, flag)')
        .in('status', ['live', 'scheduled'])
        .order('status', { ascending: false }) // live first
        .order('kickoff_time', { ascending: true });

      if (competition) {
        builder = builder.eq('competition', competition);
      }
      return builder;
    },
  });

  // Real‑time: invalidate when any match changes
  useRealtimeSubscription({
    table: 'matches',
    invalidateKeys: [['matches', 'live', competition]],
  });

  return {
    matches: liveQuery.data ?? [],
    isLoading: liveQuery.isLoading,
    error: liveQuery.error,
  };
}