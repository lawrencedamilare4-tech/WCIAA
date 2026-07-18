// src/features/tournament-intelligence/hooks/useBrackets.ts
import { useSupabaseQuery } from '@/shared/hooks/useSupabaseQuery';
import { supabase } from '@/shared/lib/supabase';

export function useBrackets() {
  return useSupabaseQuery({
    queryKey: ['tournament-brackets'],
    queryBuilder: () =>
      supabase
        .from('brackets')
        .select(`
          *,
          match:matches(
            home_team:teams!matches_home_team_id_fkey(name),
            away_team:teams!matches_away_team_id_fkey(name),
            home_score,
            away_score,
            status
          ),
          team1:teams!brackets_team1_id_fkey(name, flag),
          team2:teams!brackets_team2_id_fkey(name, flag),
          winner_team:teams!brackets_winner_team_id_fkey(name, flag)
        `)
        .order('round'),
  });
}