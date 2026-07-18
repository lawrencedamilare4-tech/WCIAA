// src/features/ai-analyst/components/ChatWindow.tsx
import { useRef, useEffect, useState } from 'react';
import { MessageBubble } from './MessageBubble';
import { SuggestedPrompts } from './SuggestedPrompts';
import { Button } from '@/shared/components/ui/button';
import { Send, Square } from 'lucide-react';

interface Props {
  messages: any[];
  onSend: (content: string) => void;
  isStreaming: boolean;
  onStop: () => void;
}

export function ChatWindow({ messages, onSend, isStreaming, onStop }: Props) {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    onSend(input.trim());
    setInput('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <SuggestedPrompts onSelect={(prompt) => onSend(prompt)} />
        )}
        {messages.map((msg, i) => (
          <MessageBubble
            key={i}
            role={msg.role}
            content={msg.content}
            isStreaming={msg.isStreaming}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask WCIA anything..."
            className="flex-1 h-10 rounded-md border border-gray-300 dark:border-gray-600 bg-white px-3 text-sm"
            disabled={isStreaming}
          />
          {isStreaming ? (
            <Button type="button" variant="outline" size="icon" onClick={onStop}>
              <Square className="h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" size="icon" disabled={!input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}