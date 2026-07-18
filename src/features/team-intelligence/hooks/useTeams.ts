// src/features/team-intelligence/hooks/useTeams.ts
import { useSupabaseQuery } from '@/shared/hooks/useSupabaseQuery';
import { supabase } from '@/shared/lib/supabase';

export function useTeams() {
  return useSupabaseQuery({
    queryKey: ['teams'],
    queryBuilder: () =>
      supabase
        .from('teams')
        .select('*')
        .order('name'),
  });
}