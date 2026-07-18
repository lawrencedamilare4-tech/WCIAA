import { NotificationItem } from './components/NotificationItem';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Button } from '../../shared/components/ui/button';
import { Skeleton } from '../../shared/components/ui/skeleton';
import { useRealtimeSubscription } from '../../shared/hooks/useRealtimeSubscription';
import { useSupabaseQuery } from '../../shared/hooks/useSupabaseQuery';
import { supabase } from '../../shared/lib/supabase';
import { slideUp } from '../../shared/utils/animations';
import { useWalletUser } from '../auth/components/WalletUserProvider';

export default function NotificationsPage() {
  const { user } = useWalletUser();

  const { data: notifications, isLoading, error, refetch } = useSupabaseQuery({
    queryKey: ['notifications', user?.id],
    queryBuilder: () =>
      supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(50),
    enabled: !!user,
  });

  // Real‑time subscription: when a new notification arrives, invalidate cache
  useRealtimeSubscription({
    table: 'notifications',
    filter: user ? `user_id=eq.${user.id}` : undefined,
    invalidateKeys: [['notifications', user?.id]],
  });

  const handleMarkRead = async (id: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);
    if (error) toast.error('Failed to mark as read');
    else refetch();
  };

  const handleClearAll = async () => {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('user_id', user!.id);
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

      {isLoading && <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16" />)}</div>}

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