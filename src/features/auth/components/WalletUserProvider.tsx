import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useWalletStore } from '@/stores/wallet-store';

interface WalletUser {
  walletAddress: string;
}

interface WalletUserContextValue {
  user: WalletUser | null;
  isConnected: boolean;
}

const WalletUserContext = createContext<WalletUserContextValue | undefined>(undefined);

export function WalletUserProvider({ children }: { children: React.ReactNode }) {
  const { address, isConnected } = useWalletStore();

  // Derive user object from the wallet store
  const user: WalletUser | null = address ? { walletAddress: address } : null;

  const value: WalletUserContextValue = {
    user,
    isConnected,
  };

  return (
    <WalletUserContext.Provider value={value}>
      {children}
    </WalletUserContext.Provider>
  );
}

export function useWalletUser() {
  const context = useContext(WalletUserContext);
  if (context === undefined) {
    throw new Error('useWalletUser must be used within a WalletUserProvider');
  }
  return context;
}