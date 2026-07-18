// src/features/tactical-center/components/TacticalReportCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Markdown } from '@/shared/components/Markdown';

interface TacticalData {
  formation?: string;
  pressing?: string;
  weaknesses?: string[];
  transitions?: string;
}

interface Props {
  report: {
    id: string;
    content: string;
    created_at: string;
    match: {
      home_team: { name: string } | null;
      away_team: { name: string } | null;
    } | null;
  };
}

export function TacticalReportCard({ report }: Props) {
  let data: TacticalData = {};
  try {
    data = JSON.parse(report.content);
  } catch {
    // plain Markdown fallback
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          {report.match?.home_team?.name} vs {report.match?.away_team?.name}
        </CardTitle>
        <p className="text-xs text-gray-500">
          AI tactical analysis • {new Date(report.created_at).toLocaleDateString()}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.formation && (
          <div>
            <h4 className="text-sm font-semibold mb-2">Formation</h4>
            <FormationBadge formation={data.formation} />
          </div>
        )}
        {data.pressing && (
          <div>
            <h4 className="text-sm font-semibold mb-2">Pressing Intensity</h4>
            <PressingIndicator level={data.pressing} />
          </div>
        )}
        {data.weaknesses && data.weaknesses.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2">Weaknesses</h4>
            <WeaknessList items={data.weaknesses} />
          </div>
        )}
        {data.transitions && (
          <div>
            <h4 className="text-sm font-semibold mb-2">Transitions</h4>
            <Markdown>{data.transitions}</Markdown>
          </div>
        )}
        {!data.formation && !data.pressing && !data.weaknesses && !data.transitions && (
          <Markdown>{report.content}</Markdown>
        )}
      </CardContent>
    </Card>
  );
}

// FormationBadge.tsx
import { Badge } from '@/shared/components/ui/badge';
export function FormationBadge({ formation }: { formation: string }) {
  return <Badge variant="primary" className="text-sm px-3 py-1">{formation}</Badge>;
}

// PressingIndicator.tsx
import { cn } from '@/shared/utils/cn';

const levelMap: Record<string, { label: string; width: string; color: string }> = {
  low: { label: 'Low', width: '25%', color: 'bg-green-500' },
  medium: { label: 'Medium', width: '50%', color: 'bg-yellow-500' },
  high: { label: 'High', width: '75%', color: 'bg-orange-500' },
  'very high': { label: 'Very High', width: '100%', color: 'bg-red-500' },
};

export function PressingIndicator({ level }: { level: string }) {
  const config = levelMap[level.toLowerCase()] ?? { label: level, width: '50%', color: 'bg-gray-300' };
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full transition-all', config.color)} style={{ width: config.width }} />
      </div>
      <span className="text-sm font-medium">{config.label}</span>
    </div>
  );
}

// WeaknessList.tsx
export function WeaknessList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 dark:text-gray-400">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}