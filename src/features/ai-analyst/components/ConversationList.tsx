// src/features/ai-analyst/components/ConversationList.tsx
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Plus, MessageSquare, X } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

interface Props {
  conversations: Array<{ id: string; title: string }>;
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  isLoading: boolean;
  onClose?: () => void;
}

export function ConversationList({ conversations, activeId, onSelect, onNew, isLoading, onClose }: Props) {
  return (
    <div className="w-full h-full flex flex-col p-3">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-text-secondary">Chats</h2>
        <div className="flex gap-2">
          <Button onClick={onNew} size="sm" variant="outline" className="h-8 w-8 p-0">
            <Plus className="h-4 w-4" />
          </Button>
          {onClose && (
            <Button onClick={onClose} size="sm" variant="ghost" className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto space-y-1">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-9 w-full" />)
        ) : conversations.length === 0 ? (
          <p className="text-xs text-text-tertiary text-center py-4">No conversations yet</p>
        ) : (
          conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => onSelect(conv.id)}
              className={cn(
                'w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2',
                activeId === conv.id
                  ? 'bg-bg-tertiary text-text-primary font-medium'
                  : 'text-text-secondary hover:bg-bg-secondary'
              )}
            >
              <MessageSquare className="h-4 w-4 shrink-0" />
              <span className="truncate">{conv.title || 'New Chat'}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}