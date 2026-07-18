import { useSupabaseQuery } from '@/shared/hooks/useSupabaseQuery';
import { getTournamentAIReport } from '../services/tournament-service';

export function useTournamentAI() {
  return useSupabaseQuery({
    queryKey: ['tournament-ai-report'],
    queryBuilder: () => getTournamentAIReport(),
  });
}
