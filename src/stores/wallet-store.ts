import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WalletState {
  address: string | null;
  isConnected: boolean;
  chainId: string | null;
  setWallet: (address: string, chainId: string) => void;
  clearWallet: () => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      address: null,
      isConnected: false,
      chainId: null,
      setWallet: (address, chainId) => set({ address, isConnected: true, chainId }),
      clearWallet: () => set({ address: null, isConnected: false, chainId: null }),
    }),
    {
      name: 'wcia-wallet', // localStorage key
    }
  )
);