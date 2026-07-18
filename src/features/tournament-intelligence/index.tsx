import { useStandings } from './hooks/useStandings';
import { useBrackets } from './hooks/useBrackets';
import { useTournamentAI } from './hooks/useTournamentAI';
import { StandingsGrid } from './components/StandingsGrid';
import { BracketView } from './components/BracketView';
import { AITournamentInsight } from './components/AITournamentInsight';
import { motion } from 'framer-motion';
import { slideUp } from '../../shared/utils/animations';
import { Skeleton } from '../../shared/components/ui/skeleton';

export default function TournamentIntelligencePage() {
  const { data: standings, isLoading: sLoading, error: sError } = useStandings();
  const { data: brackets, isLoading: bLoading, error: bError } = useBrackets();
  const { data: aiReport, isLoading: aiLoading } = useTournamentAI();

  return (
    <motion.div
      className="max-w-7xl mx-auto space-y-8 p-4 md:p-6"
      variants={slideUp}
      initial="hidden"
      animate="visible"
    >
      <h1 className="text-2xl font-bold">Tournament Intelligence</h1>

      {aiLoading ? <Skeleton className="h-40" /> : <AITournamentInsight report={aiReport} />}

      {/* Group Stage */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Group Stage</h2>
        {sError && <p className="text-danger">Failed to load standings.</p>}
        {sLoading ? <Skeleton className="h-64" /> : <StandingsGrid standings={standings ?? []} />}
      </div>

      {/* Knockout Bracket */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Knockout Bracket</h2>
        {bError && <p className="text-danger">Failed to load brackets.</p>}
        {bLoading ? <Skeleton className="h-64" /> : <BracketView brackets={brackets ?? []} />}
      </div>
    </motion.div>
  );
}