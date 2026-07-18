// src/features/predictions/components/ConfidenceBar.tsx
interface Props {
  value: number; // 0 to 1
}

export function ConfidenceBar({ value }: Props) {
  return (
    <div className="flex-1 h-2 bg-bg-tertiary rounded-full overflow-hidden">
      <div
        className="h-full bg-brand transition-all duration-500"
        style={{ width: `${Math.round(value * 100)}%` }}
      />
    </div>
  );
}