// mcp-server/index.js
import http from 'node:http';

const PORT = 8000;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// ---------- Agents (inline, no TypeScript imports needed) ----------
const agents = {
  statistics: {
    name: 'statistics',
    description: 'Analyzes match statistics (xG, possession, shots, etc.)',
    systemPrompt: 'You are a professional football statistics analyst. Provide concise, data‑driven insights. Use numbers to support your observations.',
    generatePrompt(context: any) {
      return `Analyze the key statistics for this match. Context: ${JSON.stringify(context)}`;
    },
  },
  tactical: {
    name: 'tactical',
    description: 'Provides tactical breakdown of a match',
    systemPrompt: 'You are a UEFA Pro‑Licence football coach. Provide tactical insight into formations, pressing, transitions, and weaknesses.',
    generatePrompt(context: any) {
      return `Provide a tactical analysis for this match. Context: ${JSON.stringify(context)}`;
    },
  },
  prediction: {
    name: 'prediction',
    description: 'Predicts match outcomes with confidence',
    systemPrompt: 'You are a football prediction expert. Provide a winner prediction with a confidence score (0-1).',
    generatePrompt(context: any) {
      return `Predict the outcome of this match. Context: ${JSON.stringify(context)}`;
    },
  },
  commentary: {
    name: 'commentary',
    description: 'Generates live match commentary',
    systemPrompt: 'You are an enthusiastic football commentator. Provide exciting minute‑by‑minute updates.',
    generatePrompt(context: any) {
      return `Commentate on this match. Context: ${JSON.stringify(context)}`;
    },
  },
  tournament: {
    name: 'tournament',
    description: 'Analyzes tournament standings and scenarios',
    systemPrompt: 'You are a tournament analyst. Explain qualification scenarios and bracket possibilities.',
    generatePrompt(context: any) {
      return `Analyze the tournament situation. Context: ${JSON.stringify(context)}`;
    },
  },
  fan_education: {
    name: 'fan_education',
    description: 'Explains football concepts to beginners',
    systemPrompt: 'You are a friendly football teacher. Explain concepts in simple terms.',
    generatePrompt(context: any) {
      return `Explain a football concept. Context: ${JSON.stringify(context)}`;
    },
  },
};

// ---------- HTTP server ----------
const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', async () => {
    try {
      const { method, params } = JSON.parse(body);

      // ----- tools/list -----
      if (method === 'tools/list') {
        const tools = Object.values(agents).map(a => ({
          name: a.name,
          description: a.description,
          inputSchema: {
            type: 'object',
            properties: {
              query: { type: 'string', description: 'What to ask the agent' },
              context: { type: 'object', description: 'Optional match/player context' },
            },
            required: ['query'],
          },
        }));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ tools }));
        return;
      }

      // ----- tools/call -----
      if (method === 'tools/call') {
        const { name, arguments: args } = params;
        const agent = agents[name];
        if (!agent) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Unknown agent' }));
          return;
        }

        if (!GROQ_API_KEY) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'GROQ_API_KEY not set' }));
          return;
        }

        const prompt = agent.generatePrompt(args.context || {});
        const messages = [
          { role: 'system', content: agent.systemPrompt },
          { role: 'user', content: prompt },
        ];

        // Call Groq
        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages,
          }),
        });

        if (!groqRes.ok) {
          const err = await groqRes.json().catch(() => ({}));
          res.writeHead(groqRes.status, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err.error?.message || 'Groq request failed' }));
          return;
        }

        const data = await groqRes.json();
        const content = data.choices?.[0]?.message?.content ?? '';

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ content: [{ type: 'text', text: content }] }));
        return;
      }

      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unknown method' }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
  });
});

server.listen(PORT, () => {
  console.log(`MCP server running on http://localhost:${PORT}`);
});