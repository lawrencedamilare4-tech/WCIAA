// src/features/player-intelligence/hooks/usePlayerGroqAnalysis.ts
import { useQuery } from '@tanstack/react-query';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export function usePlayerGroqAnalysis(playerName: string | undefined) {
  return useQuery({
    queryKey: ['player-groq-analysis', playerName],
    queryFn: async () => {
      if (!playerName) return '';

      if (!GROQ_API_KEY || GROQ_API_KEY === 'gsk_your_key_here') {
        throw new Error('Groq API key is missing. Check your .env file.');
      }

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content:
                'You are a football scout. Provide a concise, insightful analysis of the player’s performance in the 2026 World Cup so far. Mention their position, key contributions, strengths, and any areas for improvement.',
            },
            {
              role: 'user',
              content: `Analyze the performance of ${playerName} in the 2026 World Cup group stage.`,
            },
          ],
          max_tokens: 300,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error?.message || 'Failed to fetch AI analysis');
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new Error('Empty response from AI');
      return content;
    },
    enabled: !!playerName,
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });
}