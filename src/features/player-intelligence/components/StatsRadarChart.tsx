import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';

interface Props {
  stats: Record<string, number>; // e.g., { pace: 85, shooting: 78, passing: 82, ... }
}

export function StatsRadarChart({ stats }: Props) {
  const data = Object.entries(stats).map(([key, value]) => ({
    attribute: key.replace(/_/g, ' '),
    value: Math.min(value, 100),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={data}>
        <PolarGrid stroke="var(--color-border-primary)" />
        <PolarAngleAxis
          dataKey="attribute"
          tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }}
        />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
        <Radar
          name="Player"
          dataKey="value"
          stroke="var(--color-brand)"
          fill="var(--color-brand)"
          fillOpacity={0.2}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}