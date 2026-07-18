import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Markdown } from '@/shared/components/Markdown';

interface Props {
  report: { content: string; created_at: string };
}

export function AITeamReport({ report }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">AI Scouting Report</CardTitle>
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