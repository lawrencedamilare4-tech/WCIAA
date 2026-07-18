// src/features/tournament-intelligence/hooks/useTournamentAI.ts
import { useSupabaseQuery } from '@/shared/hooks/useSupabaseQuery';
import { supabase } from '@/shared/lib/supabase';

export function useTournamentAI() {
  return useSupabaseQuery({
    queryKey: ['tournament-ai-report'],
    queryBuilder: () =>
      supabase
        .from('ai_reports')
        .select('*')
        .eq('type', 'tournament')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
  });
}