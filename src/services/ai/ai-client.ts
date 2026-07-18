// src/services/ai/ai-client.ts
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export async function streamChat(
  messages: { role: string; content: string }[],
  context?: any,
  signal?: AbortSignal
) {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages,
      stream: true,
    }),
    signal,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || "Groq API error");
  }

  // Return the body so your existing useChat hook can read it
  return response.body!;
}

export async function fetchReport(matchId: string, type: string) {
  // For non‑streaming report generation, you can use the same endpoint with stream:false.
  // We'll skip premium logic for now.
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a football match reporter. Generate a detailed report.",
        },
        {
          role: "user",
          content: `Match ID: ${matchId}, report type: ${type}`,
        },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) throw new Error("Failed to fetch report");
  const data = await response.json();
  return data.choices[0].message.content;
}