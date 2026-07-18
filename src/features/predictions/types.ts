import type { Database } from '@/shared/types/supabase';

export type PredictionRow = Database['public']['Tables']['predictions']['Row'];
export type MatchWithTeams = Database['public']['Tables']['matches']['Row'] & {
  home_team: { name: string; flag: string | null } | null;
  away_team: { name: string; flag: string | null } | null;
};