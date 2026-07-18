// src/features/team-intelligence/components/AITeamReport.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useTeamGroqAnalysis } from '../hooks/useTeamGroqAnalysis';
import { Markdown } from '@/shared/components/Markdown';

interface Props {
  teamName: string;
}

export function AITeamReport({ teamName }: Props) {
  const { data: analysis, isLoading, error } = useTeamGroqAnalysis(teamName);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">AI Performance Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : error ? (
          <p className="text-sm text-danger">Could not load analysis.</p>
        ) : (
          <Markdown content={analysis || ''} />
        )}
      </CardContent>
    </Card>
  );
}