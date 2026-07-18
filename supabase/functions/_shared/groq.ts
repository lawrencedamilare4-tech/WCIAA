import Groq from "npm:groq-sdk";

let groq: Groq;

export function createGroqClient() {
  if (!groq) {
    const apiKey = Deno.env.get("GROQ_API_KEY");
    if (!apiKey) throw new Error("Missing GROQ_API_KEY");
    groq = new Groq({ apiKey });
  }
  return groq;
}