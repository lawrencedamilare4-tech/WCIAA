// src/features/premium-reports/hooks/usePurchasedReport.ts
import { useSupabaseQuery } from '@/shared/hooks/useSupabaseQuery';
import { supabase } from '@/shared/lib/supabase';

export function usePurchasedReport(matchId: string, reportType: string) {
  return useSupabaseQuery({
    queryKey: ['ai-report', matchId, reportType, 'premium'],
    queryBuilder: () =>
      supabase
        .from('ai_reports')
        .select('*')
        .eq('match_id', matchId)
        .eq('type', reportType)
        .eq('premium', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
    enabled: !!matchId && !!reportType,
  });
}