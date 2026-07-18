import { supabase } from '@/shared/lib/supabase';
import type { Database } from '@/shared/types/supabase';

type Standing = Database['public']['Tables']['standings']['Row'] & {
  team: { name: string; flag: string | null } | null;
};

type Bracket = Database['public']['Tables']['brackets']['Row'] & {
  match: {
    home_team: { name: string } | null;
    away_team: { name: string } | null;
    home_score: number | null;
    away_score: number | null;
    status: string;
  } | null;
  team1: { name: string; flag: string | null } | null;
  team2: { name: string; flag: string | null } | null;
  winner_team: { name: string; flag: string | null } | null;
};

export async function getStandings(): Promise<Standing[]> {
  const { data, error } = await supabase
    .from('standings')
    .select('*, team:teams(name, flag)')
    .order('group_name')
    .order('position');
  if (error) throw error;
  return data ?? [];
}

export async function getBrackets(): Promise<Bracket[]> {
  const { data, error } = await supabase
    .from('brackets')
    .select(`
      *,
      match:matches(home_team:teams(name), away_team:teams(name), home_score, away_score, status),
      team1:teams!brackets_team1_id_fkey(name, flag),
      team2:teams!brackets_team2_id_fkey(name, flag),
      winner_team:teams!brackets_winner_team_id_fkey(name, flag)
    `)
    .order('round');
  if (error) throw error;
  return data ?? [];
}

export async function getTournamentAIReport() {
  const { data, error } = await supabase
    .from('ai_reports')
    .select('*')
    .eq('type', 'tournament')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}