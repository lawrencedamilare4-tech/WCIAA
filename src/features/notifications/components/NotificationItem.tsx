import { Check } from 'lucide-react';
import { Button } from '../../../shared/components/ui/button';
import { cn } from '../../../shared/utils/cn';

type NotificationRow = Database['public']['Tables']['notifications']['Row'];

interface Props {
  notification: NotificationRow;
  onMarkRead: (id: string) => void;
}

export function NotificationItem({ notification, onMarkRead }: Props) {
  return (
    <div
      className={cn(
        'flex items-start justify-between p-3 rounded-md border',
        notification.read ? 'bg-bg-primary border-border-primary' : 'bg-brand/5 border-brand/20'
      )}
    >
      <div>
        <p className="text-sm font-semibold">{notification.title}</p>
        {notification.message && (
          <p className="text-sm text-text-secondary mt-0.5">{notification.message}</p>
        )}
        <p className="text-xs text-text-tertiary mt-1">
          {dayjs(notification.created_at).format('MMM D, HH:mm')}
        </p>
      </div>
      {!notification.read && (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => onMarkRead(notification.id)}
        >
          <Check className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}