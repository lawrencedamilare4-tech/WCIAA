// src/features/ai-analyst/components/MessageBubble.tsx
import { User, Bot } from 'lucide-react';
import Markdown from 'react-markdown';
import { cn } from '../../../shared/utils/cn';
import { useEffect } from 'react';

interface Props {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}



export function MessageBubble({ role, content, isStreaming }: Props) {
  const isUser = role === 'user';
  useEffect(() => {
  console.log({ role, content, isStreaming });
  
}, []);
  return (
    <div className={cn('flex gap-3', isUser && 'flex-row-reverse')}>
      <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold', isUser ? 'bg-brand text-black' : 'bg-bg-tertiary text-black')}>
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div
        className={cn(
          'max-w-[80%] rounded-lg px-4 py-2.5 text-sm',
          isUser ? 'bg-brand text-black' : 'bg-bg-secondary text-black border'
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{content}</p>
        ) : (
          <Markdown>{content}</Markdown>
        )}
        {isStreaming && <span className="inline-block w-1.5 h-4 bg-text-secondary animate-pulse ml-1 align-text-bottom" />}
      </div>
    </div>
  );
}