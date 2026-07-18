// src/features/team-intelligence/hooks/useTeamGroqAnalysis.ts
import { useQuery } from '@tanstack/react-query';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export function useTeamGroqAnalysis(teamName: string | undefined) {
  return useQuery({
    queryKey: ['team-groq-analysis', teamName],
    queryFn: async () => {
      // 1. Early return if no team name
      if (!teamName) {
        console.warn('useTeamGroqAnalysis: No team name provided.');
        return '';
      }

      // 2. Check for API key
      if (!GROQ_API_KEY || GROQ_API_KEY === 'gsk_your_key_here') {
        throw new Error('Groq API key is missing or invalid. Check your .env file.');
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
                'You are a football analyst. Provide a concise, insightful summary of the team’s performance in the 2026 World Cup group stage, including key players, tactical approach, strengths, and weaknesses.',
            },
            {
              role: 'user',
              content: `Analyze the performance of ${teamName} in the 2026 World Cup so far.`,
            },
          ],
          max_tokens: 400,
        }),
      });

      // 3. Handle HTTP errors
      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        console.error('Groq API error:', response.status, errBody);
        throw new Error(
          errBody.error?.message || `Groq API request failed with status ${response.status}`
        );
      }

      // 4. Parse and validate the response
      const data = await response.json();

      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        console.error('Groq response is missing content:', data);
        throw new Error('Groq returned an empty response. Try again.');
      }

      return content;
    },
    enabled: !!teamName,
    staleTime: 10 * 60 * 1000,
    retry: 1, // retry once if the first attempt fails
  });
}