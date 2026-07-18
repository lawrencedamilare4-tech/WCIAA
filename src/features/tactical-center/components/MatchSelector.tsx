// src/features/tactical-center/components/MatchSelector.tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';

interface Report {
  id: string;
  match: {
    home_team: { name: string } | null;
    away_team: { name: string } | null;
  } | null;
}

interface Props {
  reports: Report[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function MatchSelector({ reports, selectedId, onSelect }: Props) {
  return (
    <Select value={selectedId ?? ''} onValueChange={onSelect}>
      <SelectTrigger className="w-full sm:w-80">
        <SelectValue placeholder="Select a match..." />
      </SelectTrigger>
      <SelectContent>
        {reports.map((r) => (
          <SelectItem key={r.id} value={r.id}>
            {r.match?.home_team?.name ?? '?'} vs {r.match?.away_team?.name ?? '?'}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}