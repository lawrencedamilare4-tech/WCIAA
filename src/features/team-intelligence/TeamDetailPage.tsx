// src/features/team-intelligence/TeamDetailPage.tsx
import { useParams } from 'react-router-dom';
import { useTeamDetail } from './hooks/useTeamDetail';
import { TeamDetailHero } from './components/TeamDetailHero';
import { SquadTable } from './components/SquadTable';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { motion } from 'framer-motion';
import { slideUp } from '@/shared/utils/animations';
import { useTeamGroqAnalysis } from './hooks/useTeamGroqAnalysis';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import Markdown from 'react-markdown';

export default function TeamDetailPage() {
  const { teamId } = useParams<{ teamId: string }>();
  const { data, isLoading, error } = useTeamDetail(teamId);

  const teamName = data?.team.name;
  const {
    data: aiAnalysis,
    isLoading: aiLoading,
    error: aiError,
  } = useTeamGroqAnalysis(teamName);

  // ---- Error / Loading ----
  if (!teamId) return <div className="text-danger p-8">No team ID provided.</div>;
  if (error) return <div className="text-danger p-8">Failed to load team.</div>;

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

        {/* AI Performance Analysis – live from Groq */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">AI Performance Analysis</CardTitle>
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