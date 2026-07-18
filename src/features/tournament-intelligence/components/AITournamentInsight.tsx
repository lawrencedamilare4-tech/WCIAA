import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Markdown } from '../../../shared/components/Markdown';

export function AITournamentInsight({ report }: { report: { content: string; created_at: string } | null }) {
  if (!report) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Tournament Insight</CardTitle>
      </CardHeader>
      <CardContent>
        <Markdown content={report.content} />
        <p className="text-xs text-text-tertiary mt-2">
          Generated {new Date(report.created_at).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  );
}