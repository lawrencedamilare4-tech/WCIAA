import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import type { Player } from '../types';

interface Props {
  players: Player[];
}

export function SquadTable({ players }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Squad</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border-primary">
              <tr className="text-left text-text-secondary">
                <th className="py-2 pr-4 font-medium">#</th>
                <th className="py-2 pr-4 font-medium">Name</th>
                <th className="py-2 pr-4 font-medium">Position</th>
                <th className="py-2 pr-4 font-medium">Age</th>
                <th className="py-2 font-medium">Caps</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => (
                <tr key={player.id} className="border-b border-border-primary last:border-0 hover:bg-bg-secondary">
                  <td className="py-2 pr-4">{player.jersey_number ?? '-'}</td>
                  <td className="py-2 pr-4 font-medium">{player.name}</td>
                  <td className="py-2 pr-4">{player.position ?? '-'}</td>
                  <td className="py-2 pr-4">{player.date_of_birth ? new Date().getFullYear() - new Date(player.date_of_birth).getFullYear() : '-'}</td>
                  <td className="py-2">{player.stats?.caps ?? 0}</td>
                </tr>
              ))}
              {players.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-text-tertiary">No players found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}