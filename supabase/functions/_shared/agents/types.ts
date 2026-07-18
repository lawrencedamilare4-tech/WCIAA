export interface AgentContext {
  match?: any;
  events?: any[];
  stats?: any[];
  query?: string; // for chat
}

export interface Agent {
  name: string;
  description: string;
  systemPrompt: string;
  generatePrompt(context: AgentContext): string;
}