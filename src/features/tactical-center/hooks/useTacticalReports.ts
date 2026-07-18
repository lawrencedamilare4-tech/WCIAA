import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/shared/lib/supabase';

interface TacticalReport {
  id: string;
  content: string;
  created_at: string;
  match: {
    id: string;
    home_team: { name: string } | null;
    away_team: { name: string } | null;
    home_score: number;
    away_score: number;
    status: string;
  } | null;
}

export function useTacticalReports() {
  return useQuery<TacticalReport[]>({
    queryKey: ['ai-reports', 'tactical'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_reports')
        .select('*, match:matches!ai_reports_match_id_fkey(id, home_team:teams!matches_home_team_id_fkey(name), away_team:teams!matches_away_team_id_fkey(name), home_score, away_score, status)')
        .eq('type', 'tactical')
        .order('created_at', { ascending: false })
        .limit(10);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useTacticalReportById(reportId: string | null) {
  return useQuery<TacticalReport | null>({
    queryKey: ['ai-report', 'tactical', reportId],
    queryFn: async () => {
      if (!reportId) return null;
      const { data, error } = await supabase
        .from('ai_reports')
        .select('*, match:matches!ai_reports_match_id_fkey(id, home_team:teams!matches_home_team_id_fkey(name), away_team:teams!matches_away_team_id_fkey(name), home_score, away_score, status)')
        .eq('id', reportId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!reportId,
  });
}