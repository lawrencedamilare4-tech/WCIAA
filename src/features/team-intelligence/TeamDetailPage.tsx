import { useParams } from 'react-router-dom';
import { useTeamDetail } from './hooks/useTeamDetail';
import { useTeamAIAnalysis } from './hooks/useTeamAIAnalysis';
import { TeamDetailHero } from './components/TeamDetailHero';
import { SquadTable } from './components/SquadTable';
import { AITeamReport } from './components/AITeamReport';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { motion } from 'framer-motion';
import { slideUp } from '@/shared/utils/animations';

export default function TeamDetailPage() {
  const { teamId } = useParams<{ teamId: string }>();
  const { data, isLoading, error } = useTeamDetail(teamId);
  const { data: aiReport, isLoading: aiLoading } = useTeamAIAnalysis(teamId);

  if (!teamId) return <div className="text-danger">No team ID provided.</div>;
  if (error) return <div className="text-danger">Failed to load team.</div>;
  if (isLoading || !data) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-40" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  const { team, standing, players } = data;

  return (
    <motion.div
      className="max-w-5xl mx-auto space-y-6 p-4 md:p-6"
      variants={slideUp}
      initial="hidden"
      animate="visible"
    >
      <TeamDetailHero team={team} standing={standing} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SquadTable players={players} />
        </div>
        <div>
          {aiLoading ? (
            <Skeleton className="h-40" />
          ) : aiReport ? (
            <AITeamReport report={aiReport} />
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