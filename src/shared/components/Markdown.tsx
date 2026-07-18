import ReactMarkdown from 'react-markdown';
import { cn } from "../utils/cn";

interface MarkdownProps {
  content: string;
  className?: string;
}

export function Markdown({ content, className }: MarkdownProps) {
  return (
    <div className={cn('prose prose-sm max-w-none dark:prose-invert', className)}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}