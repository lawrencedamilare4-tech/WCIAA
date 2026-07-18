import { useSupabaseQuery } from '@/shared/hooks/useSupabaseQuery';
import { supabase } from '@/shared/lib/supabase';

interface UseAIReportOptions {
  matchId: string;
  type: 'match_summary' | 'tactical' | 'prediction' | 'commentary';
  enabled?: boolean;
}

export function useAIReport({ matchId, type, enabled = true }: UseAIReportOptions) {
  return useSupabaseQuery({
    queryKey: ['ai-report', matchId, type],
    queryBuilder: () =>
      supabase
        .from('ai_reports')
        .select('*')
        .eq('match_id', matchId)
        .eq('type', type)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes – reports change slowly
  });
}