import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import type { Database } from '@/shared/types/supabase';
import { supabase } from '../lib/supabase';

type TableName = keyof Database['public']['Tables'];
type RowType<T extends TableName> = Database['public']['Tables'][T]['Row'];

interface UseRealtimeSubscriptionOptions<T extends TableName> {
  /** The table to listen to */
  table: T;
  /** Optional filter (e.g., 'match_id=eq.uuid') */
  filter?: string;
  /** Query keys to invalidate on INSERT/UPDATE/DELETE */
  invalidateKeys?: string[][];
  /** Optional callback when an event is received */
  onEvent?: (payload: RealtimePostgresChangesPayload<RowType<T>>) => void;
}

export function useRealtimeSubscription<T extends TableName>({
  table,
  filter,
  invalidateKeys = [],
  onEvent,
}: UseRealtimeSubscriptionOptions<T>) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel(`${table}-${Math.random().toString(36).slice(2)}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
          filter,
        },
        (payload: RealtimePostgresChangesPayload<RowType<T>>) => {
          // Invalidate all provided query keys
          invalidateKeys.forEach((key) => {
            queryClient.invalidateQueries({ queryKey: key });
          });
          // Fire custom callback
          onEvent?.(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, filter, invalidateKeys, queryClient, onEvent]);
}