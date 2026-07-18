import { useState } from 'react';
import { useAllMatches } from './hooks/useAllMatches';
import { MatchList } from './components/MatchList';
import { CompetitionFilter } from './components/CompetitionFilter';
import { motion } from 'framer-motion';
import { slideUp } from '@/shared/utils/animations';

export default function LiveMatchesPage() {
  const [selectedCompetition, setSelectedCompetition] = useState<string | undefined>(undefined);
  const { data: matches, isLoading, error } = useAllMatches(selectedCompetition);

  // Extract unique competitions from all matches
  const competitions = Array.from(
    new Set(matches?.map((m) => m.competition).filter(Boolean) as string[])
  ).sort();

  return (
    <motion.div
      className="max-w-4xl mx-auto space-y-6 p-4 md:p-6"
      variants={slideUp}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">All Matches</h1>
        <CompetitionFilter
          competitions={competitions}
          selected={selectedCompetition}
          onSelect={setSelectedCompetition}
        />
      </div>
      <MatchList matches={matches ?? []} isLoading={isLoading} error={error as Error | null} />
    </motion.div>
  );
}