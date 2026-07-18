import { useNavigate } from 'react-router-dom';
import { Team } from '../../../shared/types/common';
import { Card, CardContent } from '@/shared/components/ui/card';

export function TeamCard({ team }: { team: Team }) {
  const navigate = useNavigate();

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate(`/app/teams/${team.id}`)}
    >
      <CardContent className="flex flex-col items-center justify-center p-6">
        {/* flag placeholder */}
        <div className="w-16 h-16 rounded-full bg-bg-tertiary flex items-center justify-center text-2xl">
          {team.flag ? <img src={team.flag} alt={team.name} /> :  '🏳️'}
        </div>
        <h3 className="mt-3 font-semibold text-center text-sm">{team.name}</h3>
        {team.group_name && (
          <p className="text-xs text-text-tertiary mt-1">Group {team.group_name}</p>
        )}
      </CardContent>
    </Card>
  );
}