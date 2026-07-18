// src/features/notifications/Index.tsx
import { NotificationItem } from './components/NotificationItem';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { slideUp } from '@/shared/utils/animations';
import { supabase } from '@/shared/lib/supabase';
import { useWalletUser } from '@/features/auth/components/WalletUserProvider';
import { useNotifications } from './hooks/useNotifications';
import { Wallet } from 'lucide-react';
import { useWallet } from '@/features/wallet/hooks/useWallet';

export default function NotificationsPage() {
  const { user } = useWalletUser();
  const walletAddress = user?.walletAddress;
  const { connect } = useWallet();

  const {
    data: notifications,
    isLoading,
    error,
    refetch,
  } = useNotifications();

  // If no wallet connected, show invitation
  if (!walletAddress) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Wallet className="h-16 w-16 text-gray-400" />
        <h1 className="text-2xl font-bold">Notifications</h1>
        <p className="text-gray-500 text-center max-w-md">
          Connect your wallet to see your alerts, match events, and updates.
        </p>
        <Button onClick={connect}>
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </Button>
      </div>
    );
  }

  // Mark single notification as read
  const handleMarkRead = async (id: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);
    if (error) toast.error('Failed to mark as read');
    else refetch();
  };

  // Clear all notifications for this wallet
  const handleClearAll = async () => {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('wallet_address', walletAddress);
    if (error) toast.error('Failed to clear notifications');
    else {
      toast.success('All notifications cleared');
      refetch();
    }
  };

  const unreadCount = notifications?.filter((n) => !n.read).length ?? 0;

  return (
    <motion.div
      className="max-w-2xl mx-auto space-y-6 p-4 md:p-6"
      variants={slideUp}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Notifications
          {unreadCount > 0 && <span className="text-brand ml-2 text-lg">({unreadCount})</span>}
        </h1>
        {notifications && notifications.length > 0 && (
          <Button variant="ghost" size="sm" onClick={handleClearAll}>
            Clear all
          </Button>
        )}
      </div>

      {error && <p className="text-danger">Failed to load notifications.</p>}

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      )}

      {!isLoading && notifications?.length === 0 && (
        <p className="text-text-secondary text-center py-12">No notifications yet.</p>
      )}

      {notifications && notifications.length > 0 && (
        <div className="space-y-3">
          {notifications.map((n) => (
            <NotificationItem key={n.id} notification={n} onMarkRead={handleMarkRead} />
          ))}
        </div>
      )}
    </motion.div>
  );
}