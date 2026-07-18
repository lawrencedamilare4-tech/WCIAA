// src/features/ai-analyst/components/ConversationList.tsx
import { Plus, MessageSquare } from 'lucide-react';
import { Button } from '../../../shared/components/ui/button';
import { Skeleton } from '../../../shared/components/ui/skeleton';
import { cn } from '../../../shared/utils/cn';

interface Props {
  conversations: Array<{ id: string; title: string }>;
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  isLoading: boolean;
}

export function ConversationList({ conversations, activeId, onSelect, onNew, isLoading }: Props) {
  return (
    <div className="w-64 border-r border-border-primary bg-bg-primary p-3 flex flex-col h-full">
      <Button onClick={onNew} variant="outline" className="w-full cursor-pointer hover:bg-gray-300 justify-start gap-2 mb-4">
        <Plus className="h-4 w-4" /> New Chat
      </Button>
      <div className="flex-1 overflow-y-auto space-y-1">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-9 w-full" />)
        ) : conversations.length === 0 ? (
          <p className="text-xs text-text-tertiary text-center">No conversations yet</p>
        ) : (
          conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => onSelect(conv.id)}
              className={cn(
                'w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2',
                activeId === conv.id ? 'bg-bg-tertiary text-text-primary font-medium' : 'text-text-secondary hover:bg-bg-secondary'
              )}
            >
              <MessageSquare className="h-4 w-4 shrink-0" />
              <span className="truncate">{conv.title}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}