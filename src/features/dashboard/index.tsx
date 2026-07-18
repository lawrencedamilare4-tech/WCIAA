// src/features/dashboard/index.tsx
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { LiveMatchCard } from './components/LiveMatchcard';
import { TrendingPlayerCard } from './components/Trendingplayercard';
import { useWalletUser } from '@/features/auth/components/WalletUserProvider';
import { supabase } from '@/shared/lib/supabase';
import { motion } from 'framer-motion';
import { slideUp } from '@/shared/utils/animations';
import { Link } from 'react-router-dom';
import { BrainCircuit } from 'lucide-react';
import { StatCard } from '@/shared/components/StatsCard';

export default function DashboardPage() {
  const { user } = useWalletUser();
  const walletAddress = user?.walletAddress;

  // 1. Live matches (global)
  const { data: liveMatches, isLoading: loadingLive } = useQuery({
    queryKey: ['matches', 'live'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('matches')
        .select('*, home_team:teams!matches_home_team_id_fkey(name, flag), away_team:teams!matches_away_team_id_fkey(name, flag)')
        .eq('status', 'live')
        .order('kickoff_time', { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  // 2. Trending players (sorted by goals – global)
  const { data: trendingPlayers } = useQuery({
    queryKey: ['players', 'trending'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('stats->goals', { ascending: false })
        .limit(5);
      if (error) throw error;
      return data ?? [];
    },
  });

  // 3. Latest AI report (global)
  const { data: aiReports, isLoading: aiLoading } = useQuery({
    queryKey: ['ai-reports', 'dashboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_reports')
        .select('content, type, match:matches(id, home_team:teams(name), away_team:teams(name))')
        .order('created_at', { ascending: false })
        .limit(1);
      if (error) throw error;
      return data ?? [];
    },
  });
  const latestAI = aiReports?.[0];

  // ─────────────── Per‑wallet stats ───────────────
  // 4. User predictions count
  const { data: predictionCount } = useQuery({
    queryKey: ['predictions', 'count', walletAddress],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('predictions')
        .select('*', { count: 'exact', head: true })
        .eq('wallet_address', walletAddress!);
      if (error) throw error;
      return count ?? 0;
    },
    enabled: !!walletAddress,
  });

  // 5. Premium purchases count (reports the user bought)
  const { data: premiumCount } = useQuery({
    queryKey: ['premium-purchases', 'count', walletAddress],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('premium_purchases')
        .select('*', { count: 'exact', head: true })
        .eq('wallet_address', walletAddress!);
      if (error) throw error;
      return count ?? 0;
    },
    enabled: !!walletAddress,
  });

  // 6. Rewards points – using a simple sum from premium_purchases or a dedicated points table
  // For now, we'll use the number of premium purchases * 10 as a simple reward.
  const rewardsPoints = (premiumCount ?? 0) * 10;

  return (
    <motion.div variants={slideUp} initial="hidden" animate="visible" className="space-y-6">
      {/* Quick Stats Row – now shows real per‑wallet data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Live Matches" value={liveMatches?.length ?? 0} trend="neutral" />
        <StatCard
          label="My Predictions"
          value={walletAddress ? (predictionCount ?? 0) : '—'}
          trend="up"
        />
        <StatCard
          label="Premium Reports"
          value={walletAddress ? (premiumCount ?? 0) : '—'}
        />
        <StatCard
          label="Rewards Earned"
          value={walletAddress ? rewardsPoints : '—'}
          trend="up"
        />
      </div>

      {/* Live Matches */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Live Now</h2>
        {loadingLive ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
        ) : liveMatches?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {liveMatches.map((match) => (
              <LiveMatchCard key={match.id} match={match} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-text-secondary">
              No live matches at the moment.
            </CardContent>
          </Card>
        )}
      </div>

      {/* AI Insight + Trending Players */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>AI Insight</CardTitle>
            <Link
              to="/ai-analyst"
              className="text-xs text-brand hover:underline inline-flex items-center gap-1"
            >
              <BrainCircuit className="h-3.5 w-3.5" />
              Ask AI Analyst
            </Link>
          </CardHeader>
          <CardContent>
            {aiLoading ? (
              <Skeleton className="h-20 w-full" />
            ) : latestAI ? (
              <div className="space-y-2">
                <p className="text-xs text-text-tertiary uppercase tracking-wide">
                  {latestAI.type?.replace(/_/g, ' ')} –{' '}
                  {latestAI.match?.home_team?.name} vs {latestAI.match?.away_team?.name}
                </p>
                <p className="text-sm text-text-secondary whitespace-pre-wrap line-clamp-6">
                  {latestAI.content}
                </p>
              </div>
            ) : (
              <p className="text-text-tertiary text-sm">No AI reports generated yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trending Players</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {trendingPlayers?.length ? (
              trendingPlayers.map((player) => (
                <TrendingPlayerCard key={player.id} player={player} />
              ))
            ) : (
              <Skeleton className="h-20" />
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}