import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Timeline } from '@/shared/components/Timeline';
import { useRealtimeSubscription } from '@/shared/hooks/useRealtimeSubscription';
import { useSupabaseQuery } from '@/shared/hooks/useSupabaseQuery';
import { supabase } from '@/shared/lib/supabase';
import { useAIReport } from './hooks/useAIReport';
import { toast } from 'sonner';
import { StatCard } from '@/shared/components/StatsCard';


// Map raw DB event → timeline format (icons, side, description)
function mapEventToTimeline(event: any, match: any) {
  const isHome = event.team_id === match.home_team_id;
  const side: 'home' | 'away' = isHome ? 'home' : 'away';
  let type: 'goal' | 'card' | 'substitution' | 'var' | 'half' | 'other' = 'other';
  let icon = '⚽';

  switch (event.type) {
    case 'goal':
    case 'penalty_goal':
    case 'own_goal':
      type = 'goal';
      icon = event.type === 'own_goal' ? '🥅' : '⚽';
      break;
    case 'yellow_card':
    case 'red_card':
      type = 'card';
      icon = event.type === 'red_card' ? '🟥' : '🟨';
      break;
    case 'substitution':
      type = 'substitution';
      icon = '🔄';
      break;
    case 'var_decision':
      type = 'var';
      icon = '📺';
      break;
    case 'half_start':
    case 'full_time':
      type = 'half';
      icon = '⏱️';
      break;
  }

  return {
    id: event.id,
    minute: event.minute,
    type,
    icon: <span className="text-sm">{icon}</span>,
    description: event.metadata?.description ?? event.type.replace(/_/g, ' '),
    player: event.player_id ? 'Player #' + event.player_id : undefined, // TODO: join player name
    side,
  };
}

export default function MatchIntelligencePage() {
  const { matchId } = useParams<{ matchId: string }>();

  // 1. Fetch the match metadata
  const {
    data: match,
    isLoading: matchLoading,
    error: matchError,
  } = useSupabaseQuery({
    queryKey: ['match', matchId!],
    queryBuilder: () =>
      supabase
        .from('matches')
        .select('*, home_team:teams!matches_home_team_id_fkey(*), away_team:teams!matches_away_team_id_fkey(*)')
        .eq('id', matchId!)
        .single(),
    enabled: !!matchId,
  });

  // 2. Fetch match events (timeline)
  const {
    data: events,
    isLoading: eventsLoading,
  } = useSupabaseQuery({
    queryKey: ['match-events', matchId!],
    queryBuilder: () =>
      supabase
        .from('match_events')
        .select('*')
        .eq('match_id', matchId!)
        .order('minute', { ascending: true }),
    enabled: !!matchId,
  });

  const {
    data: aiReport,
    isLoading: aiReportLoading,
  } = useAIReport({
    matchId: matchId!,
    type: 'match_summary',
    enabled: !!matchId,
  });

  // 4. Real‑time subscription
  useRealtimeSubscription({
    table: 'match_events',
    filter: `match_id=eq.${matchId}`,
    invalidateKeys: [
      ['match', matchId!],
      ['match-events', matchId!],
      ['ai-report', matchId!],
    ],
    onEvent: (payload) => {
      if (payload.eventType === 'INSERT' && payload.new.type === 'goal') {
        toast.success(`⚽ GOAL! ${payload.new.metadata?.description ?? ''}`);
      } else if (payload.eventType === 'INSERT' && (payload.new.type === 'red_card' || payload.new.type === 'yellow_card')) {
        toast.warning(`🟨 Card – ${payload.new.type.replace('_', ' ')}`);
      }
    },
  });

  // --- Handle loading / error / empty states ---
  if (!matchId) return <div className="p-8 text-center text-text-secondary">No match ID provided.</div>;

  if (matchError) {
    return <div className="p-8 text-center text-danger">Failed to load match data.</div>;
  }

  if (matchLoading || !match) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  // Map events to timeline format
  const timelineEvents = (events ?? [])
    .map((e) => mapEventToTimeline(e, match))
    .filter((e) => e.type !== 'other');

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      {/* Match Hero */}
      <div className="flex items-center justify-between">
        <div className="flex-1 text-right">
          <h2 className="text-2xl font-bold">{match.home_team?.name ?? 'Home'}</h2>
        </div>
        <div className="text-center px-8">
          <span className="text-4xl font-mono font-bold tabular-nums">
            {match.home_score} - {match.away_score}
          </span>
          <p className="text-xs text-text-tertiary mt-1">
            {match.status === 'live' ? 'LIVE' : match.status?.toUpperCase()}
          </p>
        </div>
        <div className="flex-1 text-left">
          <h2 className="text-2xl font-bold">{match.away_team?.name ?? 'Away'}</h2>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Possession" value="52%" />
        <StatCard label="Shots" value="14" trend="up" />
        <StatCard label="xG" value="1.82" />
        <StatCard label="Corners" value="7" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI Match Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {aiReportLoading ? (
            <Skeleton className="h-20 w-full" />
          ) : aiReport ? (
            <p className="text-sm text-text-secondary whitespace-pre-wrap">
              {aiReport.content}
            </p>
          ) : (
            <p className="text-sm text-text-tertiary">No summary available yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Timeline (with mapped events) */}
      <Card>
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          {eventsLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : timelineEvents.length > 0 ? (
            <Timeline events={timelineEvents} />
          ) : (
            <p className="text-sm text-text-tertiary">No events recorded.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}