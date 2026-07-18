import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '../../../shared/components/ui/button';
import { useWallet } from '../../wallet/hooks/useWallet';

export function WalletSection() {
  const { address, isConnected, connect, disconnect } = useWallet();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet</CardTitle>
      </CardHeader>
      <CardContent>
        {isConnected ? (
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm">{address?.slice(0,10)}...{address?.slice(-6)}</span>
            <Button variant="outline" size="sm" onClick={disconnect}>Disconnect</Button>
          </div>
        ) : (
          <Button onClick={connect}>Connect Injective Wallet</Button>
        )}
      </CardContent>
    </Card>
  );
}