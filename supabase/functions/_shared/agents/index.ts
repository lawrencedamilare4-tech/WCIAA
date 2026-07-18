import { statisticsAgent } from "./statistics-agent.ts";
import { tacticalAgent } from "./tactical-agent.ts";
// import all others...

const agents = {
  statistics: statisticsAgent,
  tactical: tacticalAgent,
  // ...
};

export function selectAgent(typeOrQuery: string, context: any): Agent {
  // For chat: simple keyword matching
  if (context?.query) {
    const q = context.query.toLowerCase();
    if (q.includes("stat") || q.includes("xg")) return statisticsAgent;
    if (q.includes("tactic") || q.includes("formation")) return tacticalAgent;
    // ... other logic
    return statisticsAgent; // default
  }

  // For reports: direct type
  if (typeOrQuery in agents) return agents[typeOrQuery];
  return statisticsAgent;
}