import { useRewards } from './hooks/useRewards';
import { useLeaderboard } from './hooks/useLeaderboard';
import { usePointsHistory } from './hooks/usePointsHistory';
import { RewardsHeader } from './components/RewardsHeader';
import { LeaderboardTable } from './components/LeaderboardTable';
import { PointsHistory } from './components/PointsHistory';
import { motion } from 'framer-motion';
import { Skeleton } from '../../shared/components/ui/skeleton';
import { slideUp } from '../../shared/utils/animations';
import { useWalletUser } from '../auth/components/WalletUserProvider';

export default function RewardsPage() {
  const { user } = useWalletUser();
  const { data: rewards, isLoading: rLoading, error: rError } = useRewards();
  const { data: leaderboard, isLoading: lLoading, error: lError } = useLeaderboard();
  const { data: history, isLoading: hLoading, error: hError } = usePointsHistory();

  return (
    <motion.div
      className="max-w-4xl mx-auto space-y-6 p-4 md:p-6"
      variants={slideUp}
      initial="hidden"
      animate="visible"
    >
      <h1 className="text-2xl font-bold">Rewards</h1>

      {/* Personal stats */}
      {rError && <p className="text-danger">Failed to load your points.</p>}
      {rLoading ? (
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      ) : (
        rewards && <RewardsHeader points={rewards.points} rank={rewards.rank} />
      )}

      {/* Leaderboard */}
      {lError && <p className="text-danger">Failed to load leaderboard.</p>}
      {lLoading ? <Skeleton className="h-64" /> : leaderboard && (
        <LeaderboardTable entries={leaderboard} currentUserId={user?.id} />
      )}

      {/* Points History */}
      {hError && <p className="text-danger">Failed to load history.</p>}
      {hLoading ? <Skeleton className="h-48" /> : history && (
        <PointsHistory history={history} />
      )}
    </motion.div>
  );
}