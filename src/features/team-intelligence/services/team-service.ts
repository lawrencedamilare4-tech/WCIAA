// src/features/team-intelligence/services/team-service.ts
import { supabase } from '@/shared/lib/supabase';

type Team = Database['public']['Tables']['teams']['Row'];
type Player = Database['public']['Tables']['players']['Row'];
type Standing = Database['public']['Tables']['standings']['Row'];

/**
 * Fetch all teams.
 */
export async function getTeams(): Promise<Team[]> {
  const { data, error } = await supabase.from('teams').select('*').order('name');
  if (error) throw error;
  return data ?? [];
}

/**
 * Fetch a single team with its standing and players.
 */
export async function getTeamDetail(teamId: string): Promise<{
  team: Team;
  standing: Standing | null;
  players: Player[];
}> {
  const { data: team, error } = await supabase
    .from('teams')
    .select('*')
    .eq('id', teamId)
    .single();
  if (error || !team) throw error ?? new Error('Team not found');

  const { data: standing } = await supabase
    .from('standings')
    .select('*')
    .eq('team_id', teamId)
    .maybeSingle();

  const { data: players } = await supabase
    .from('players')
    .select('*')
    .eq('team_id', teamId)
    .order('jersey_number', { ascending: true });

  return { team, standing: standing ?? null, players: players ?? [] };
}

/**
 * Fetch AI report for a team.
 * 
 * Note: This currently filters `ai_reports.match_id` as a stand‑in for team ID.
 * In a future schema update, consider adding a dedicated `player_id` / `team_id` column
 * or a polymorphic reference to make this query cleaner.
 */
export async function getTeamAIAnalysis(teamId: string) {
  const { data, error } = await supabase
    .from('ai_reports')
    .select('*')
    .eq('match_id', teamId) // temporary mapping: treat match_id as team_id
    .eq('type', 'team_analysis')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}