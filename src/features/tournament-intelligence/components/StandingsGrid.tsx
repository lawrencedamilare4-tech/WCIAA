// StandingsGrid.tsx
import { GroupStandingsTable } from './GroupStandingsTable';

interface Standing {
  id: string;
  group_name: string;
  // ... rest
}

export function StandingsGrid({ standings }: { standings: Standing[] }) {
  const groups = Array.from(new Set(standings.map((s) => s.group_name))).sort();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {groups.map((group) => (
        <GroupStandingsTable
          key={group}
          group={group}
          standings={standings.filter((s) => s.group_name === group)}
        />
      ))}
    </div>
  );
}