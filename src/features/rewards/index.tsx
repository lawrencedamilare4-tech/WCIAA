// src/features/rewards/index.tsx
import { useRewards } from './hooks/useRewards';
import { useLeaderboard } from './hooks/useLeaderboard';
import { usePointsHistory } from './hooks/usePointsHistory';
import { RewardsHeader } from './components/RewardsHeader';
import { LeaderboardTable } from './components/LeaderboardTable';
import { PointsHistory } from './components/PointsHistory';
import { motion } from 'framer-motion';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { slideUp } from '@/shared/utils/animations';
import { useWalletUser } from '@/features/auth/components/WalletUserProvider';
import { Wallet } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useWallet } from '@/features/wallet/hooks/useWallet';

export default function RewardsPage() {
  const { user } = useWalletUser();
  const walletAddress = user?.walletAddress;
  const { connect } = useWallet();

  // Only enable data fetching when a wallet is connected
  const {
    data: rewards,
    isLoading: rLoading,
    error: rError,
  } = useRewards(walletAddress);
  const {
    data: leaderboard,
    isLoading: lLoading,
    error: lError,
  } = useLeaderboard();
  const {
    data: history,
    isLoading: hLoading,
    error: hError,
  } = usePointsHistory(walletAddress);

  // No wallet connected – show a nice invitation
  if (!walletAddress) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Wallet className="h-16 w-16 text-gray-400" />
        <h1 className="text-2xl font-bold">Rewards</h1>
        <p className="text-gray-500 text-center max-w-md">
          Connect your wallet to see your points, rank on the leaderboard, and earn rewards
          for predictions and premium purchases.
        </p>
        <Button onClick={connect}>
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </Button>
      </div>
    );
  }

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
      {lLoading ? (
        <Skeleton className="h-64" />
      ) : leaderboard ? (
        <LeaderboardTable
          entries={leaderboard}
          currentWalletAddress={walletAddress}
        />
      ) : null}

      {/* Points History */}
      {hError && <p className="text-danger">Failed to load history.</p>}
      {hLoading ? <Skeleton className="h-48" /> : history && (
        <PointsHistory history={history} />
      )}
    </motion.div>
  );
}