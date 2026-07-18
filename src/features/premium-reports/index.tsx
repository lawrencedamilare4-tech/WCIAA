// src/features/premium-reports/index.tsx
import { usePremiumReports } from './hooks/usePremiumReports';
import { PremiumReportCard } from './components/PremiumReportCard';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { motion } from 'framer-motion';
import { slideUp } from '@/shared/utils/animations';
import { useWalletUser } from '@/features/auth/components/WalletUserProvider';
import { useWallet } from '@/features/wallet/hooks/useWallet';
import { Button } from '@/shared/components/ui/button';

export default function PremiumReportsPage() {
  const { matches, purchases, reportTypes, isLoading, error } = usePremiumReports();
  const { user } = useWalletUser();
  const { connect } = useWallet();

  return (
    <motion.div
      className="max-w-4xl mx-auto space-y-6 p-4 md:p-6"
      variants={slideUp}
      initial="hidden"
      animate="visible"
    >
      <h1 className="text-2xl font-bold">Premium Reports</h1>

      {!user?.walletAddress && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700 rounded-lg p-4 text-center">
          <p className="text-sm mb-2">You need to connect your wallet to purchase premium reports.</p>
          <Button onClick={connect}>Connect Wallet</Button>
        </div>
      )}

      {error && <p className="text-danger">Failed to load.</p>}

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      ) : matches.length === 0 ? (
        <p className="text-gray-500">No upcoming matches for premium reports.</p>
      ) : (
        <div className="space-y-4">
          {matches.map((match) => (
            <PremiumReportCard
              key={match.id}
              match={match}
              reportTypes={reportTypes}
              userPurchases={purchases}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}