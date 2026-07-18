import { cn } from '../utils/cn';

interface TimelineEvent {
  id: string;
  minute: number;
  type: 'goal' | 'card' | 'substitution' | 'var' | 'half' | 'other';
  icon: React.ReactNode;
  description: string;
  player?: string;
  side: 'home' | 'away';
}

interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
}

export function Timeline({ events, className }: TimelineProps) {
  return (
    <div className={cn('space-y-0', className)}>
      {events.map((event, idx) => (
        <div key={event.id} className="flex gap-4 py-2">
          <div className="flex flex-col items-center">
            <span className="text-xs font-mono text-text-tertiary w-10 text-right">
              {event.minute}&#39;
            </span>
            <div className="w-px h-full bg-border-primary my-1 last:hidden" />
          </div>
          <div className={cn(
            'flex-1 rounded-md px-3 py-1',
            event.side === 'home' ? 'ml-auto text-right' : 'mr-auto',
            'bg-bg-secondary'
          )}>
            <div className="flex items-center gap-2 text-sm">
              {event.icon}
              <span className="font-medium">{event.description}</span>
            </div>
            {event.player && <p className="text-xs text-text-secondary mt-0.5">{event.player}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}