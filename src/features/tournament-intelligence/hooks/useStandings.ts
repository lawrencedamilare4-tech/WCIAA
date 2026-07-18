import { useSupabaseQuery } from '@/shared/hooks/useSupabaseQuery';
import { supabase } from '@/shared/lib/supabase';

export function useStandings() {
  return useSupabaseQuery({
    queryKey: ['standings'],
    queryBuilder: () =>
      supabase
        .from('standings')
        .select('*, team:teams(name, flag)')
        .order('group_name')
        .order('position'),
  });
}