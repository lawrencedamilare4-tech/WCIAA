// src/features/live-matches/components/CompetitionFilter.tsx

import { Button } from "../../../shared/components/ui/button";

interface Props {
  competitions: string[];
  selected: string | undefined;
  onSelect: (comp: string | undefined) => void;
}

export function CompetitionFilter({ competitions, selected, onSelect }: Props) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Button
        variant={selected === undefined ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => onSelect(undefined)}
      >
        All
      </Button>
      {competitions.map((comp) => (
        <Button
          key={comp}
          variant={selected === comp ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => onSelect(comp)}
        >
          {comp}
        </Button>
      ))}
    </div>
  );
}