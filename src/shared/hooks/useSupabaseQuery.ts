// src/shared/hooks/useSupabaseQuery.ts
import { useQuery, type QueryKey, type UseQueryOptions } from '@tanstack/react-query';
import type { PostgrestFilterBuilder } from '@supabase/postgrest-js';
/**
 * Helper type to extract the result type from a Supabase query builder.
 * It handles .single(), .maybeSingle(), and normal array results.
 */

export function useSupabaseQuery<TQueryBuilder extends PostgrestFilterBuilder<any, any, any, any>, TError = Error>({
  queryKey,
  queryBuilder,
  ...options
}: any) {
  return useQuery({
    queryKey,
    queryFn: async () => {
      const query = queryBuilder();
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    ...options,
  });
}