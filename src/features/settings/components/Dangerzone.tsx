import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '../../../shared/components/ui/button';
import { useWalletUser } from '../../auth/components/WalletUserProvider';
export function DangerZone() {
  const { signOut } = useWalletUser();

  return (
    <Card className="border-danger/30">
      <CardHeader>
        <CardTitle className="text-danger">Danger Zone</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-between items-center">
        <span className="text-sm">Sign out of your account</span>
        <Button variant="danger" size="sm" onClick={signOut}>Sign Out</Button>
      </CardContent>
    </Card>
  );
}