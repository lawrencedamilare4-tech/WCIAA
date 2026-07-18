// src/features/dashboard/components/LiveMatchCard.tsx
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';

interface Props {
  match: any;
}

export function LiveMatchCard({ match }: Props) {
  const navigate = useNavigate();

  return (
    <Card className="p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold">{match.home_team?.name}</p>
          <p className="text-xs text-text-secondary">{match.away_team?.name}</p>
        </div>
        <div className="text-2xl font-mono font-bold">
          {match.home_score} - {match.away_score}
        </div>
      </div>
      <div className="mt-3 flex justify-between items-center">
        <span className="text-xs text-danger font-medium">LIVE {match.minute}'</span>
        <Button size="sm" variant="outline" onClick={() => navigate(`/app/match/${match.id}`)}>
          Watch
        </Button>
      </div>
    </Card>
  );
}