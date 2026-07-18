// src/features/predictions/hooks/useSubmitPrediction.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useWalletUser } from '@/features/auth/components/WalletUserProvider';
import { saveUserPrediction } from '../services/prediction-service';
import { toast } from 'sonner';

export function useSubmitPrediction(matchId: string) {
  const { user } = useWalletUser();
  const walletAddress = user?.walletAddress;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (scores: { home: number; away: number }) =>
      saveUserPrediction(walletAddress!, matchId, scores.home, scores.away),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['predictions', 'user', walletAddress] });
      toast.success('Prediction saved');
    },
    onError: (err: any) => toast.error(err.message || 'Failed to save prediction'),
  });
}