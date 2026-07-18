import { Server } from "https://deno.land/x/mcp@v0.1.0/server.ts";
import { statisticsAgent } from "../supabase/functions/_shared/agents/statistics-agent.ts";
import { tacticalAgent } from "../supabase/functions/_shared/agents/tactical-agent.ts";
import { predictionAgent } from "../supabase/functions/_shared/agents/prediction-agent.ts";
import { createGroqClient } from "../supabase/functions/_shared/groq.ts";

const groq = createGroqClient();

const server = new Server(
  {
    name: "wcia-mcp-server",
    version: "2.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define tools – one per agent
server.setRequestHandler("tools/list", async () => ({
  tools: [
    {
      name: "match_statistics",
      description: "Get advanced match statistics and xG analysis.",
      inputSchema: {
        type: "object",
        properties: {
          matchId: { type: "string" },
        },
        required: ["matchId"],
      },
    },
    {
      name: "tactical_analysis",
      description: "Provide tactical breakdown of a match.",
      inputSchema: {
        type: "object",
        properties: {
          matchId: { type: "string" },
        },
        required: ["matchId"],
      },
    },
    {
      name: "match_prediction",
      description: "Predict the outcome of an upcoming match.",
      inputSchema: {
        type: "object",
        properties: {
          matchId: { type: "string" },
        },
        required: ["matchId"],
      },
    },
  ],
}));

server.setRequestHandler("tools/call", async (request) => {
  const { name, arguments: args } = request.params;
  const { matchId } = args;

  // Fetch match data from Supabase (use service role)
  const { supabaseAdmin } = await import("../supabase/functions/_shared/supabase.ts");
  const { data: match } = await supabaseAdmin
    .from("matches")
    .select("*, home_team:teams!matches_home_team_id_fkey(*), away_team:teams!matches_away_team_id_fkey(*)")
    .eq("id", matchId)
    .single();

  const { data: events } = await supabaseAdmin
    .from("match_events")
    .select("*")
    .eq("match_id", matchId)
    .order("minute");

  const context = { match, events };

  let agent, prompt;
  switch (name) {
    case "match_statistics":
      agent = statisticsAgent;
      prompt = statisticsAgent.generatePrompt(context);
      break;
    case "tactical_analysis":
      agent = tacticalAgent;
      prompt = tacticalAgent.generatePrompt(context);
      break;
    case "match_prediction":
      agent = predictionAgent;
      prompt = predictionAgent.generatePrompt(context);
      break;
    default:
      throw new Error(`Unknown tool: ${name}`);
  }

  const completion = await groq.chat.completions.create({
    model: "mixtral-8x7b-32768",
    messages: [
      { role: "system", content: agent.systemPrompt },
      { role: "user", content: prompt },
    ],
  });

  const content = completion.choices[0]?.message?.content ?? "";

  return {
    content: [{ type: "text", text: content }],
  };
});

// Start the server (stdio transport for use with Claude Desktop, etc.)
server.listen();