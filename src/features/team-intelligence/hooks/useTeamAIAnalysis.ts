import { useSupabaseQuery } from '@/shared/hooks/useSupabaseQuery';
import { getTeamAIAnalysis } from '../services/team-service';

export function useTeamAIAnalysis(teamId: string | undefined) {
  return useSupabaseQuery({
    queryKey: ['ai-report', 'team', teamId],
    queryBuilder: () => getTeamAIAnalysis(teamId!),
    enabled: !!teamId,
  });
}