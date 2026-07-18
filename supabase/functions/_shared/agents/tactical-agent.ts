import type { Agent, AgentContext } from "./types.ts";

export const tacticalAgent: Agent = {
  name: "tactical",
  description: "Analyses formations, pressing, transitions, weaknesses",
  systemPrompt: `You are a UEFA Pro‑Licence football coach. Provide tactical insight into formations, pressing patterns, transitions, and tactical weaknesses. Be precise and avoid generic statements.`,
  generatePrompt(context: AgentContext) {
    // For simplicity, we’d pass formation data or event patterns.
    return `Based on the match events and team data, provide a tactical analysis. What formations are being used? Where are the key battles? Any tactical adjustments?`;
  },
};