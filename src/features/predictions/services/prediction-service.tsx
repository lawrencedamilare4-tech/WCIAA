import { supabase } from '@/shared/lib/supabase';


/**
 * Fetch AI predictions (wallet_address is NULL) for a list of matches.
 */
export async function getAIPredictions(matchIds: string[]): Promise<any[]> {
  if (matchIds.length === 0) return [];
  const { data, error } = await supabase
    .from('predictions')
    .select('*')
    .in('match_id', matchIds)
    .is('wallet_address', null)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

/**
 * Fetch the current wallet's predictions for a list of matches.
 */
export async function getUserPredictions(walletAddress: string, matchIds: string[]): Promise<any[]> {
  if (!walletAddress || matchIds.length === 0) return [];
  const { data, error } = await supabase
    .from('predictions')
    .select('*')
    .eq('wallet_address', walletAddress)
    .in('match_id', matchIds);
  if (error) throw error;
  return data ?? [];
}

/**
 * Upsert a user prediction.
 */
export async function saveUserPrediction(
  walletAddress: string,
  matchId: string,
  predictedHomeScore: number,
  predictedAwayScore: number
): Promise<any> {
  const { data, error } = await supabase
    .from('predictions')
    .upsert({
      wallet_address: walletAddress,
      match_id: matchId,
      predicted_home_score: predictedHomeScore,
      predicted_away_score: predictedAwayScore,
      result:
        predictedHomeScore > predictedAwayScore
          ? 'home'
          : predictedHomeScore < predictedAwayScore
          ? 'away'
          : 'draw',
    })
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

/**
 * Fetch upcoming matches.
 */
export async function getUpcomingMatches(): Promise<any[]> {
  const { data, error } = await supabase
    .from('matches')
    .select('*, home_team:teams!matches_home_team_id_fkey(name, flag), away_team:teams!matches_away_team_id_fkey(name, flag)')
    .eq('status', 'scheduled')
    .order('kickoff_time', { ascending: true });
  if (error) throw error;
  return data ?? [];
}