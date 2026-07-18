import { useSupabaseQuery } from '@/shared/hooks/useSupabaseQuery';
import { getTeamDetail } from '../services/team-service';

export function useTeamDetail(teamId: string | undefined) {
  return useSupabaseQuery({
    queryKey: ['team', teamId],
    queryBuilder: () => getTeamDetail(teamId!),
    enabled: !!teamId,
  });
}