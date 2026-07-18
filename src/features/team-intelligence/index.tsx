import { useTeams } from './hooks/useTeams';
import { motion } from 'framer-motion';
import { slideUp } from '../../shared/utils/animations';
import { Skeleton } from '../../shared/components/ui/skeleton';
import {TeamCard} from './components/TeamCard';

export default function TeamIntelligencePage() {
  const { data: teams, isLoading, error } = useTeams();

  return (
    <motion.div
      className="max-w-6xl mx-auto space-y-6 p-4 md:p-6"
      variants={slideUp}
      initial="hidden"
      animate="visible"
    >
      <h1 className="text-2xl font-bold">Team Intelligence</h1>

      {error && <p className="text-danger">Failed to load teams.</p>}

      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      )}

      {!isLoading && teams?.length === 0 && (
        <p className="text-text-secondary">No teams found.</p>
      )}

      {teams && teams.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {teams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      )}
    </motion.div>
  );
}