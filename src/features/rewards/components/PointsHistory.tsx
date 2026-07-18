// PointsHistory.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import dayjs from 'dayjs';

interface PointsLogEntry {
  id: string;
  amount: number;
  reason: string;
  created_at: string;
}

interface Props {
  history: PointsLogEntry[];
}

export function PointsHistory({ history }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <p className="text-text-tertiary text-sm">No points earned yet.</p>
        ) : (
          <div className="space-y-2">
            {history.map((entry) => (
              <div key={entry.id} className="flex justify-between items-center text-sm">
                <div>
                  <span className="capitalize font-medium">{entry.reason.replace(/_/g, ' ')}</span>
                  <span className="text-text-tertiary ml-2">{dayjs(entry.created_at).format('MMM D, HH:mm')}</span>
                </div>
                <span className="font-mono font-semibold text-success">+{entry.amount}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}