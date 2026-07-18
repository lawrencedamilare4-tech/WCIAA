import { useParams } from 'react-router-dom';
import { usePlayerDetail } from './hooks/usePlayerDetail';
import { usePlayerAIAnalysis } from './hooks/usePlayerAIAnalysis';
import { PlayerDetailHero } from './components/PlayerDetailHero';
import { StatsRadarChart } from './components/StatsRadarChart';
import { PlayerRecentActivity } from './components/PlayerRecentActivity';
import { AIPlayerReport } from './components/AIPlayerReport';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../../shared/components/ui/Card';
import { Skeleton } from '../../shared/components/ui/skeleton';
import { slideUp } from '../../shared/utils/animations';

export default function PlayerDetailPage() {
  const { playerId } = useParams<{ playerId: string }>();
  const { data: player, isLoading, error } = usePlayerDetail(playerId);
  const { data: aiReport, isLoading: aiLoading } = usePlayerAIAnalysis(playerId);

  if (!playerId) return <div className="text-danger">No player ID provided.</div>;
  if (error) return <div className="text-danger">Failed to load player.</div>;
  if (isLoading || !player) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-32" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  const radarStats: Record<string, number> = {
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

        <div>
          {aiLoading ? (
            <Skeleton className="h-40" />
          ) : aiReport ? (
            <AIPlayerReport report={aiReport} />
          ) : (
            <div className="text-sm text-text-secondary p-4 border rounded-md">
              No AI analysis available.
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}