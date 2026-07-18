// GroupStandingsTable.tsx
import { cn } from '@/shared/utils/cn';

interface Standing {
  id: string;
  position: number;
  team: { name: string; flag: string | null } | null;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goals_for: number;
  goals_against: number;
  goal_diff: number;
  points: number;
}

export function GroupStandingsTable({ group, standings }: { group: string; standings: Standing[] }) {
  return (
    <div className="border rounded-lg overflow-hidden bg-bg-primary">
      <div className="bg-bg-secondary px-4 py-2 text-sm font-semibold text-text-secondary">
        Group {group}
      </div>
      <table className="w-full text-sm">
        <thead className="border-b border-border-primary">
          <tr className="text-left text-text-secondary">
            <th className="py-2 px-3 font-medium">#</th>
            <th className="py-2 px-3 font-medium">Team</th>
            <th className="py-2 px-3 font-medium text-center">P</th>
            <th className="py-2 px-3 font-medium text-center">GD</th>
            <th className="py-2 px-3 font-medium text-center">Pts</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((row) => (
            <tr
              key={row.id}
              className={cn(
                'border-b border-border-primary last:border-0 hover:bg-bg-secondary',
                row.position <= 2 && 'bg-success/5' // highlight qualifying spots
              )}
            >
              <td className="py-2 px-3 font-mono">{row.position}</td>
              <td className="py-2 px-3 font-medium">{row.team?.name ?? '-'}</td>
              <td className="py-2 px-3 text-center">{row.played}</td>
              <td className="py-2 px-3 text-center">{row.goal_diff}</td>
              <td className="py-2 px-3 text-center font-bold">{row.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}