// src/features/predictions/hooks/usePredictions.ts
import { useQuery } from '@tanstack/react-query';
import { useWalletUser } from '@/features/auth/components/WalletUserProvider';
import { getUpcomingMatches, getAIPredictions, getUserPredictions } from '../services/prediction-service';

export function usePredictions() {
  const { user } = useWalletUser();
  const walletAddress = user?.walletAddress;

  // Fetch upcoming matches
  const matchesQuery = useQuery({
    queryKey: ['matches', 'upcoming'],
    queryFn: getUpcomingMatches,
  });

  const matchIds = (matchesQuery.data ?? []).map((m) => m.id);

  const aiQuery = useQuery({
    queryKey: ['predictions', 'ai', matchIds],
    queryFn: () => getAIPredictions(matchIds),
    enabled: matchIds.length > 0,
  });

  // User predictions (for this wallet)
  const userQuery = useQuery({
    queryKey: ['predictions', 'user', walletAddress, matchIds],
    queryFn: () => getUserPredictions(walletAddress!, matchIds),
    enabled: !!walletAddress && matchIds.length > 0,
  });

  return {
    matches: matchesQuery.data ?? [],
    aiPredictions: aiQuery.data ?? [],
    userPredictions: userQuery.data ?? [],
    isLoading: matchesQuery.isLoading || aiQuery.isLoading || userQuery.isLoading,
    error: matchesQuery.error ?? aiQuery.error ?? userQuery.error,
  };
}