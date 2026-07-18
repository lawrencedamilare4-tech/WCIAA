// BracketView.tsx
import { cn } from '@/shared/utils/cn';

interface Bracket {
  id: string;
  round: string;
  team1: { name: string; flag: string | null } | null;
  team2: { name: string; flag: string | null } | null;
  winner_team: { name: string; flag: string | null } | null;
  match: {
    home_score: number | null;
    away_score: number | null;
    status: string;
  } | null;
}

const ROUND_ORDER = ['Round of 16', 'Quarter‑final', 'Semi‑final', 'Final'];

export function BracketView({ brackets }: { brackets: Bracket[] }) {
  const rounds = ROUND_ORDER.filter((r) => brackets.some((b) => b.round === r));

  if (rounds.length === 0) {
    return <p className="text-text-secondary text-sm">Knockout stage not available yet.</p>;
  }

  return (
    <div className="space-y-8">
      {rounds.map((round) => (
        <div key={round}>
          <h3 className="text-sm font-semibold mb-3 text-text-secondary uppercase tracking-wide">{round}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {brackets
              .filter((b) => b.round === round)
              .map((match) => (
                <div
                  key={match.id}
                  className="flex items-center justify-between p-3 border rounded-md bg-bg-primary"
                >
                  <div className={cn('flex-1 text-right', match.winner_team?.name === match.team1?.name && 'font-bold')}>
                    {match.team1?.name ?? 'TBD'}
                  </div>
                  <div className="px-3 text-center font-mono text-sm">
                    {match.match?.status === 'finished' ? (
                      <span>{match.match.home_score} - {match.match.away_score}</span>
                    ) : (
                      <span className="text-text-tertiary">vs</span>
                    )}
                  </div>
                  <div className={cn('flex-1', match.winner_team?.name === match.team2?.name && 'font-bold')}>
                    {match.team2?.name ?? 'TBD'}
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}