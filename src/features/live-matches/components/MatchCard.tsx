// src/features/live-matches/components/MatchCard.tsx
import { Card } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

interface MatchCardProps {
  match: any; // typed as Match
}

export function MatchCard({ match }: MatchCardProps) {
  const navigate = useNavigate();
  const isLive = match.status === 'live';
  const isFinished = match.status === 'finished';

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Teams & Score */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="flex-1 text-right">
            <p className="font-semibold truncate">{match.home_team?.name ?? 'Home'}</p>
          </div>
          <div className="text-center min-w-[80px]">
            {isFinished || isLive ? (
              <span className="text-2xl font-mono font-bold tabular-nums">
                {match.home_score} - {match.away_score}
              </span>
            ) : (
              <span className="text-sm text-text-secondary">
                {dayjs(match.kickoff_time).format('HH:mm')}
              </span>
            )}
          </div>
          <div className="flex-1">
            <p className="font-semibold truncate">{match.away_team?.name ?? 'Away'}</p>
          </div>
        </div>

        {/* Meta info */}
        <div className="flex items-center gap-2 sm:ml-4">
          {isLive && (
            <Badge variant="danger" className="uppercase">
              LIVE {match.minute}'
            </Badge>
          )}
          {isFinished && (
            <Badge variant="default" className="uppercase">
              FT
            </Badge>
          )}
          {!isLive && !isFinished && (
            <Badge variant="default">
              {dayjs(match.kickoff_time).format('MMM D, HH:mm')}
            </Badge>
          )}
          <span className="text-xs text-text-tertiary hidden sm:inline">
            {match.competition}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/match/${match.id}`)}
          >
            {isLive ? 'Watch' : 'Preview'}
          </Button>
        </div>
      </div>
    </Card>
  );
}