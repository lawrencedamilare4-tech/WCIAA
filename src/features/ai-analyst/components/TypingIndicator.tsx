// src/features/ai-analyst/components/TypingIndicator.tsx
export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-2">
      <span className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  );
}