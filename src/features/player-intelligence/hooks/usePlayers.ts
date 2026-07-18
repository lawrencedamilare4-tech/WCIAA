import { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/shared/lib/supabase';
import { useDebounce } from '@/shared/hooks/useDebounce';

const PAGE_SIZE = 20;

export function usePlayers() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const query = useInfiniteQuery({
    queryKey: ['players', debouncedSearch],
    queryFn: async ({ pageParam = 0 }) => {
      let builder = supabase
        .from('players')
        .select('*, team:teams(name, flag)', { count: 'exact' })
        .order('name')
        .range(pageParam, pageParam + PAGE_SIZE - 1);

      if (debouncedSearch) {
        builder = builder.ilike('name', `%${debouncedSearch}%`);
      }
      const { data, error, count } = await builder;
      if (error) throw error;
      return { data: data ?? [], nextPage: (data?.length ?? 0) < PAGE_SIZE ? undefined : pageParam + PAGE_SIZE, total: count ?? 0 };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
    staleTime: 30_000,
  });

  return {
    players: query.data?.pages.flatMap((p) => p.data) ?? [],
    totalCount: query.data?.pages[0]?.total ?? 0,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: !!query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    error: query.error,
    search,
    setSearch,
  };
}