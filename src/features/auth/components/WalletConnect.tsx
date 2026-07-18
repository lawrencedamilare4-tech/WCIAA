import { Button } from '@/shared/components/ui/button';
import { useWalletAuth } from '../hooks/useWalletAuth';
import { Wallet } from 'lucide-react';

export function WalletConnect() {
  const { handleConnectWallet, isConnecting } = useWalletAuth();

  return (
    <Button
      variant="ghost"
      size="lg"
      className="w-full justify-start gap-3"
      onClick={handleConnectWallet}
      disabled={isConnecting}
    >
      <Wallet className="h-5 w-5" />
      <span>Connect Injective Wallet</span>
    </Button>
  );
}