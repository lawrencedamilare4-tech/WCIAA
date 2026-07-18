// src/features/predictions/components/UpsetAlertCard.tsx
import { Card, CardContent } from '@/shared/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface Props {
  match: any;
  aiPrediction: any;
}

export function UpsetAlertCard({ match, aiPrediction }: Props) {
  return (
    <Card className="border-warning bg-warning/5">
      <CardContent className="py-4 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-sm">Potential Upset</p>
          <p className="text-xs text-text-secondary mt-1">
            AI gives {match.away_team?.name} a {Math.round(aiPrediction.confidence * 100)}% chance
            to beat {match.home_team?.name} – despite being the underdog.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}