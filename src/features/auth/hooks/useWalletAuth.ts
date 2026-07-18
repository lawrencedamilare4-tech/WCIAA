import { useCallback, useState } from 'react';
import { connectWallet } from '../../wallet/wallet-service'; // we'll define later
import { toast } from 'sonner';
import { useWalletUser } from '../components/WalletUserProvider';
import { supabase } from '../../../shared/lib/supabase';

export function useWalletAuth() {
  const { user, isGuest, refreshProfile } = useWalletUser();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectWallet = useCallback(async () => {
    if (!user) return;
    setIsConnecting(true);
    try {
      const walletAddress = await connectWallet();
      // Save wallet address to wallet_connections table
      const { error } = await supabase.from('wallet_connections').upsert({
        user_id: user.id,
        wallet_address: walletAddress,
        chain_id: 'injective-1', // or dynamic
      });
      if (error) throw error;
      toast.success('Wallet connected');
      refreshProfile();
    } catch (err: any) {
      toast.error(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  }, [user, refreshProfile]);

  return { handleConnectWallet, isConnecting };
}