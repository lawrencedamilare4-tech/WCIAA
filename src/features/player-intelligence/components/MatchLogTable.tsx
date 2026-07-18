import { MatchPerformance } from "../types";

export default function MatchLogTable({ matches }: { matches: MatchPerformance[] }) {
  if (!matches || matches.length === 0) {
    return <p className="text-sm text-text-secondary">No recent match data available.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-border text-left text-sm">
        <thead>
          <tr>
            <th className="px-3 py-2 font-medium text-text-secondary">Date</th>
            <th className="px-3 py-2 font-medium text-text-secondary">Opponent</th>
            <th className="px-3 py-2 font-medium text-text-secondary">Comp</th>
            <th className="px-3 py-2 font-medium text-text-secondary">Rating</th>
            <th className="px-3 py-2 font-medium text-text-secondary">Goals</th>
            <th className="px-3 py-2 font-medium text-text-secondary">Assists</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {matches.map((match) => (
            <tr key={match.id}>
              <td className="px-3 py-2">{match.date ?? "—"}</td>
              <td className="px-3 py-2">{match.opponent}</td>
              <td className="px-3 py-2">{match.competition ?? "—"}</td>
              <td className="px-3 py-2">{match.rating ?? "—"}</td>
              <td className="px-3 py-2">{match.goals ?? 0}</td>
              <td className="px-3 py-2">{match.assists ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
