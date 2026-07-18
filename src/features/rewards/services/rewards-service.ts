import { supabase } from '@/shared/lib/supabase';
import type { Database } from '@/shared/types/supabase';

type PointsLog = Database['public']['Tables']['points_log']['Row'];

export async function getUserPoints(userId: string): Promise<{ points: number; rank: number }> {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('points')
    .eq('id', userId)
    .single();
  if (error || !profile) throw error ?? new Error('Profile not found');

  // Calculate rank (count of users with more points)
  const { count, error: countError } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .gt('points', profile.points);
  if (countError) throw countError;

  const rank = (count ?? 0) + 1;
  return { points: profile.points, rank };
}

export async function getLeaderboard(limit = 50): Promise<Array<{ id: string; username: string | null; full_name: string | null; points: number; rank: number }>> {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map((row, idx) => ({ ...row, rank: idx + 1 }));
}

export async function getPointsHistory(userId: string, limit = 20): Promise<PointsLog[]> {
  const { data, error } = await supabase
    .from('points_log')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}