import { Button } from "../../../shared/components/ui/button";

// src/features/ai-analyst/components/SuggestedPrompts.tsx
const prompts = [
  "Explain xG and why it's important",
  "Who's the most impactful player this tournament?",
  "Analyze the last match between Brazil and Argentina",
  "What are the weaknesses of a 4-3-3 formation?",
  "Predict the winner of Group B",
];

interface Props {
  onSelect: (prompt: string) => void;
}

export function SuggestedPrompts({ onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2 p-4">
      {prompts.map((prompt) => (
        <Button key={prompt} variant="outline" size="sm" onClick={() => onSelect(prompt)}>
          {prompt}
        </Button>
      ))}
    </div>
  );
}