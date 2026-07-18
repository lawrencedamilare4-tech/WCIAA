// LeaderboardTable.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { cn } from '@/shared/utils/cn';

interface LeaderboardEntry {
  id: string;
  username: string | null;
  full_name: string | null;
  points: number;
  rank: number;
}

interface Props {
  entries: LeaderboardEntry[];
  currentUserId?: string;
}

export function LeaderboardTable({ entries, currentUserId }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border-primary">
              <tr className="text-left text-text-secondary">
                <th className="py-2 pr-4 font-medium">#</th>
                <th className="py-2 pr-4 font-medium">User</th>
                <th className="py-2 font-medium text-right">Points</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr
                  key={entry.id}
                  className={cn(
                    'border-b border-border-primary last:border-0',
                    entry.id === currentUserId && 'bg-brand/5'
                  )}
                >
                  <td className="py-2 pr-4 font-mono">{entry.rank}</td>
                  <td className="py-2 pr-4">
                    {entry.full_name || entry.username || 'Anonymous'}
                  </td>
                  <td className="py-2 text-right font-mono font-semibold">{entry.points.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}