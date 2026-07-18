// src/features/wallet/hooks/useWallet.ts
import { useCallback, useEffect } from 'react';
import { useWalletStore } from '@/stores/wallet-store';
import { toast } from 'sonner';
import { connectWallet, disconnectWallet, getWalletAddress } from '../wallet-service';

export function useWallet() {
  const { address, isConnected, setWallet, clearWallet } = useWalletStore();

  const connect = useCallback(async () => {
    try {
      const addr = await connectWallet();
      setWallet(addr, 'injective-1');
      toast.success('Wallet connected');
    } catch (err: any) {
      toast.error(err.message || 'Could not connect wallet');
    }
  }, [setWallet]);

  const disconnect = useCallback(async () => {
    await disconnectWallet();
    clearWallet();
    toast.success('Wallet disconnected');
  }, [clearWallet]);

  useEffect(() => {
    if (isConnected) {
      getWalletAddress().then((addr) => {
        if (!addr) clearWallet();
      });
    }
  }, [isConnected, clearWallet]);

  return { address, isConnected, connect, disconnect };
}