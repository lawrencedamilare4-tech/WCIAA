import type { Agent, AgentContext } from "./types.ts";

export const statisticsAgent: Agent = {
  name: "statistics",
  description: "Analyzes match statistics (xG, possession, shots, etc.)",
  systemPrompt: `You are a professional football statistics analyst. Provide concise, data‑driven insights. Use numbers to support your observations. Never speculate without data.`,
  generatePrompt(context: AgentContext) {
    const { match, stats } = context;
    return `
      Match: ${match?.home_team?.name} vs ${match?.away_team?.name}
      Score: ${match?.home_score} - ${match?.away_score}
      Statistics: ${JSON.stringify(stats)}

      Summarise the key statistical points of this match. Highlight any outliers or interesting trends.
    `;
  },
};