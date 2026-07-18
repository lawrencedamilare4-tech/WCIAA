import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/shared/lib/supabase';
import { useWalletUser } from '@/features/auth/components/WalletUserProvider';

export function useNotifications() {
  const { user } = useWalletUser();
  const walletAddress = user?.walletAddress;

  return useQuery({
    queryKey: ['notifications', walletAddress],
    queryFn: async () => {
      if (!walletAddress) return [];
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('wallet_address', walletAddress)
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!walletAddress,
  });
}