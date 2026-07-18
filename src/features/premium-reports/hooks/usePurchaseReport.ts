// src/features/premium-reports/hooks/usePurchaseReport.ts
import { useMutation } from '@tanstack/react-query';
import { useWalletUser } from '@/features/auth/components/WalletUserProvider';
import { purchaseAndGenerateReport } from '../services/premium-service';
import { makeX402Payment } from '@/services/payment/x402-service';
import { toast } from 'sonner';

export function usePurchaseReport(matchId: string, reportType: string) {
  const { user } = useWalletUser();
  const walletAddress = user?.walletAddress;

  return useMutation({
    mutationFn: async () => {
      if (!walletAddress) throw new Error('Wallet not connected');

      // 1. Execute payment
      const txHash = await makeX402Payment('5'); // amount could be dynamic based on report type
      toast.success('Payment submitted, verifying...');

      // 2. Record purchase and generate report
      const report = await purchaseAndGenerateReport(walletAddress, matchId, reportType, txHash);
      return report;
    },
    onError: (err: any) => {
      toast.error(err.message || 'Purchase failed');
    },
  });
}