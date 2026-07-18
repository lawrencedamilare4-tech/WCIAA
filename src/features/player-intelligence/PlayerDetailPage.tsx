// src/features/player-intelligence/PlayerDetailPage.tsx
import { useParams } from 'react-router-dom';
import { usePlayerDetail } from './hooks/usePlayerDetail';
import { PlayerDetailHero } from './components/PlayerDetailHero';
import { StatsRadarChart } from './components/StatsRadarChart';
import { PlayerRecentActivity } from './components/PlayerRecentActivity';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { motion } from 'framer-motion';
import { slideUp } from '@/shared/utils/animations';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import Markdown from 'react-markdown';
import { usePlayerGroqAnalysis } from './hooks/usePlayerGroqAnalysis';

export default function PlayerDetailPage() {
  const { playerId } = useParams<{ playerId: string }>();
  const { data: player, isLoading, error } = usePlayerDetail(playerId);

  // Live Groq analysis
  const {
    data: aiAnalysis,
    isLoading: aiLoading,
    error: aiError,
  } = usePlayerGroqAnalysis(player?.name);

  if (!playerId) return <div className="text-danger p-8">No player ID provided.</div>;
  if (error) return <div className="text-danger p-8">Failed to load player.</div>;
  if (isLoading || !player) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-32" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  const radarStats = {
    pace: player.stats?.pace ?? 0,
    shooting: player.stats?.shooting ?? 0,
    passing: player.stats?.passing ?? 0,
    dribbling: player.stats?.dribbling ?? 0,
    defending: player.stats?.defending ?? 0,
    physical: player.stats?.physical ?? 0,
  };

  return (
    <motion.div
      className="max-w-5xl mx-auto space-y-6 p-4 md:p-6"
      variants={slideUp}
      initial="hidden"
      animate="visible"
    >
      <PlayerDetailHero player={player} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold mb-4">Performance Radar</h3>
            <StatsRadarChart stats={radarStats} />
          </CardContent>
        </Card>

        <PlayerRecentActivity playerId={player.id} />

        {/* AI Scout Report – live from Groq */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">AI Scout Report</CardTitle>
          </CardHeader>
          <CardContent>
            {aiLoading ? (
              <Skeleton className="h-40 w-full" />
            ) : aiError ? (
              <p className="text-sm text-danger">
                Could not load analysis. {aiError instanceof Error ? aiError.message : ''}
              </p>
            ) : (
              <Markdown>{aiAnalysis || 'No analysis available.'}</Markdown>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}