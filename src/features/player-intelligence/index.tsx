import { usePlayers } from './hooks/usePlayers';
import { PlayerCard } from './components/PlayerCard';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Button } from '@/shared/components/ui/button';
import { motion } from 'framer-motion';
import { slideUp } from '@/shared/utils/animations';
import { useEffect, useRef, useCallback } from 'react';
import { Input } from '@/shared/components/ui/Input';

export default function PlayerIntelligencePage() {
  const {
    players,
    isLoading,
    error,
    search,
    setSearch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePlayers();

  // Infinite scroll observer
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  return (
    <motion.div
      className="max-w-4xl mx-auto space-y-6 p-4 md:p-6"
      variants={slideUp}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Player Intelligence</h1>
        <Input
          placeholder="Search players..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64"
        />
      </div>

      {error && <p className="text-danger">Failed to load players.</p>}

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      )}

      {!isLoading && players.length === 0 && (
        <p className="text-gray-500">No players found.</p>
      )}

      {players.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {players.map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>

          {/* j */}

          {/* Load more trigger */}
          <div ref={loadMoreRef} className="flex justify-center py-4">
            {isFetchingNextPage ? (
              <Skeleton className="h-8 w-32" />
            ) : hasNextPage ? (
              <Button variant="ghost" onClick={() => fetchNextPage()}>
                Load more
              </Button>
            ) : (
              <p className="text-sm text-gray-400">All players loaded</p>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
}