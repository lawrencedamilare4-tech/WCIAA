// src/features/premium-reports/hooks/usePremiumReports.ts
import { useSupabaseQuery } from '@/shared/hooks/useSupabaseQuery';
import { supabase } from '@/shared/lib/supabase';
import { useWalletUser } from '@/features/auth/components/WalletUserProvider';

const PREMIUM_REPORT_TYPES = [
  { key: 'deep_tactical', label: 'Deep Tactical Analysis', price: '5 INJ' },
  { key: 'scouting_report', label: 'Scouting Report', price: '3 INJ' },
  { key: 'advanced_prediction', label: 'Advanced Prediction', price: '2 INJ' },
];

export function usePremiumReports() {
  const { user } = useWalletUser();
  const walletAddress = user?.walletAddress;

  const matchesQuery = useSupabaseQuery({
    queryKey: ['matches', 'upcoming-premium'],
    queryBuilder: () =>
      supabase
        .from('matches')
        .select('*, home_team:teams!matches_home_team_id_fkey(name), away_team:teams!matches_away_team_id_fkey(name)')
        .in('status', ['scheduled', 'live'])
        .order('kickoff_time', { ascending: true }),
  });

  // Fetch purchases for the current wallet
  const purchasesQuery = useSupabaseQuery({
    queryKey: ['premium-purchases', walletAddress],
    queryBuilder: () =>
      walletAddress
        ? supabase.from('premium_purchases').select('match_id, report_type').eq('wallet_address', walletAddress)
        : null,
    enabled: !!walletAddress,
  });

  return {
    matches: matchesQuery.data ?? [],
    purchases: purchasesQuery.data ?? [],
    reportTypes: PREMIUM_REPORT_TYPES,
    isLoading: matchesQuery.isLoading || purchasesQuery.isLoading,
    error: matchesQuery.error ?? purchasesQuery.error,
  };
}