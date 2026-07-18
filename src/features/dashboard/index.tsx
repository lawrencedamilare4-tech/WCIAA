// src/features/dashboard/index.tsx
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { LiveMatchCard } from './components/LiveMatchcard';
import { TrendingPlayerCard } from './components/Trendingplayercard';
import { useWalletUser } from '@/features/auth/components/WalletUserProvider';
import { supabase } from '@/shared/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { slideUp } from '@/shared/utils/animations';
import { Link } from 'react-router-dom';
import { BrainCircuit, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { StatCard } from '@/shared/components/StatsCard';

const TRENDING_IMAGES = [
  {
    src: 'https://img.youtube.com/vi/_cV8QcKp3GU/hqdefault.jpg',
    alt: 'France 0-2 Spain | FIFA World Cup 2026 Semi-Final highlights',
    videoUrl: 'https://www.youtube.com/watch?v=_cV8QcKp3GU',
  },
  {
    src: 'https://img.youtube.com/vi/oB2mK8eJli4/hqdefault.jpg',
    alt: 'England 1-2 Argentina | FIFA World Cup 2026 Semi-Final highlights',
    videoUrl: 'https://www.youtube.com/watch?v=oB2mK8eJli4',
  },
  {
    src: 'https://img.youtube.com/vi/zZxxDbLxEi4/hqdefault.jpg',
    alt: 'Argentina 3-1 Switzerland | FIFA World Cup 2026 Quarter-Final highlights',
    videoUrl: 'https://www.youtube.com/watch?v=zZxxDbLxEi4',
  },
  {
    src: 'https://img.youtube.com/vi/VHoctq0AOg8/hqdefault.jpg',
    alt: 'Spain 2-1 Belgium | FIFA World Cup 2026 Quarter-Final highlights',
    videoUrl: 'https://www.youtube.com/watch?v=VHoctq0AOg8',
  },
];

export default function DashboardPage() {
  const { user } = useWalletUser();
  const walletAddress = user?.walletAddress;

  // ==================== Carousel state ====================
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % TRENDING_IMAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isHovered]);

  const goTo = (index: number) => setCurrentSlide(index);
  const prev = () =>
    setCurrentSlide((s) => (s - 1 + TRENDING_IMAGES.length) % TRENDING_IMAGES.length);
  const next = () => setCurrentSlide((s) => (s + 1) % TRENDING_IMAGES.length);

  // ==================== Data fetching ====================
  // 1. Live matches
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

  // 2. Trending players
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

  // 3. Latest AI report
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

  // 5. Premium purchases count
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

  // 6. Rewards points
  const rewardsPoints = (premiumCount ?? 0) * 10;

  // ==================== Render ====================
  return (
    <motion.div variants={slideUp} initial="hidden" animate="visible" className="space-y-6">
      
      {/* Trending Images Carousel */}
      <div
        className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={currentSlide}
            src={TRENDING_IMAGES[currentSlide].src}
            alt={TRENDING_IMAGES[currentSlide].alt}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        </AnimatePresence>

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Navigation arrows */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {TRENDING_IMAGES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className={cn(
                'w-2.5 h-2.5 rounded-full transition-all',
                idx === currentSlide ? 'bg-white scale-110' : 'bg-white/50'
              )}
            />
          ))}
        </div>
      </div>
      
      {/* Quick Stats Row */}
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

      {/* AI Insight + Trending Players side‑by‑side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Summary */}
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

        {/* Trending Players */}
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