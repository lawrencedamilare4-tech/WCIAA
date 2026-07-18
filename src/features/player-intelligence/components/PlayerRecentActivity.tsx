// PlayerRecentActivity.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { useSupabaseQuery } from '@/shared/hooks/useSupabaseQuery';
import { supabase } from '@/shared/lib/supabase';

interface Props {
  playerId: string;
}

export function PlayerRecentActivity({ playerId }: Props) {
  const { data: events } = useSupabaseQuery({
    queryKey: ['player-events', playerId],
    queryBuilder: () =>
      supabase
        .from('match_events')
        .select('*, match:matches(home_team:teams(name), away_team:teams(name))')
        .or(`player_id.eq.${playerId},assist_player_id.eq.${playerId}`)
        .order('created_at', { ascending: false })
        .limit(5),
    enabled: !!playerId,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {!events || events.length === 0 ? (
          <p className="text-text-tertiary">No recent events.</p>
        ) : (
          events.map((event) => (
            <div key={event.id} className="flex justify-between">
              <span>
                {event.type.replace('_', ' ')} vs{' '}
                {event.match?.home_team?.name} vs {event.match?.away_team?.name}
              </span>
              <span className="text-text-tertiary">{event.minute}&#39;</span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}