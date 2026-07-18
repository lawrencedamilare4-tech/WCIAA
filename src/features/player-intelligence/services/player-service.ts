import { supabase } from '@/shared/lib/supabase';
import type { Player } from '../types';

export async function getPlayers(search?: string): Promise<Player[]> {
  let query = supabase
    .from('players')
    .select('*, team:teams(name, flag)')
    .order('name');

  if (search) {
    query = query.ilike('name', `%${search}%`);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getPlayerDetail(playerId: string): Promise<Player | null> {
  const { data, error } = await supabase
    .from('players')
    .select('*, team:teams(name, flag)')
    .eq('id', playerId)
    .single();
  if (error || !data) throw error ?? new Error('Player not found');
  return data;
}

export async function getPlayerAIAnalysis(playerId: string) {
  const { data, error } = await supabase
    .from('ai_reports')
    .select('*')
    // We'll store player reports with match_id = null and a 'player_scout' type and store player_id in metadata
    .eq('type', 'player_scout')
    .eq('significant_event_id', playerId) // hack: use significant_event_id column to store player_id (or use a separate column)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}