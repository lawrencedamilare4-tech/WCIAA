// src/features/premium-reports/components/PremiumReportCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { usePurchasedReport } from '../hooks/usePurchasedReport';
import { usePurchaseReport } from '../hooks/usePurchaseReport';
import { useWalletUser } from '@/features/auth/components/WalletUserProvider';

interface Props {
  match: any;
  reportTypes: { key: string; label: string; price: string }[];
  userPurchases: { match_id: string; report_type: string }[];
}

export function PremiumReportCard({ match, reportTypes, userPurchases }: Props) {
  const { user } = useWalletUser();
  const walletConnected = !!user?.walletAddress;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center justify-between">
          <span>{match.home_team?.name} vs {match.away_team?.name}</span>
          <Badge variant="default">{match.competition}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {!walletConnected && (
          <div className="text-sm text-amber-500 mb-2">Connect your wallet to purchase reports.</div>
        )}
        {reportTypes.map((rt) => {
          const purchased = userPurchases.some(
            (p) => p.match_id === match.id && p.report_type === rt.key
          );
          const purchaseMutation = usePurchaseReport(match.id, rt.key);
          const { data: existingReport } = usePurchasedReport(match.id, rt.key);

          return (
            <div key={rt.key} className="flex items-center justify-between border-b pb-3 last:border-0">
              <div>
                <p className="font-medium text-sm">{rt.label}</p>
                <p className="text-xs text-gray-500">{rt.price}</p>
              </div>
              {purchased ? (
                <Button size="sm" variant="outline" onClick={() => { /* open report viewer */ }}>
                  View Report
                </Button>
              ) : (
                <Button
                  size="sm"
                  className='text-black'
                  onClick={() => purchaseMutation.mutate()}
                  disabled={!walletConnected || purchaseMutation.isPending}
                >
                  {purchaseMutation.isPending ? 'Processing...' : 'Buy'}
                </Button>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}