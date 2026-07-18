import { cn } from "../utils/cn";
import { Card } from "./ui/Card";


interface StatCardProps {
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({ label, value, trend, icon, className }: StatCardProps) {
  return (
    <Card className={cn('p-4', className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-secondary">{label}</p>
        {icon && <div className="text-text-tertiary">{icon}</div>}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-semibold font-mono tabular-nums">{value}</span>
        {trend && (
          <span
            className={cn('text-xs font-medium', {
              'text-success': trend === 'up',
              'text-danger': trend === 'down',
              'text-text-tertiary': trend === 'neutral',
            })}
          >
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
          </span>
        )}
      </div>
    </Card>
  );
}