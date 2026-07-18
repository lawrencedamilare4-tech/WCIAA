# WCIA 2.0 – World Cup Intelligence Agency

**AI‑powered football intelligence platform with Injective Web3 integration.**  
Understand **why** events happen during matches – not just the score.

![WCIA 2.0 Dashboard](https://via.placeholder.com/800x400?text=WCIA+2.0+Dashboard)

---

## 🧠 What is WCIA 2.0?

WCIA 2.0 is a production‑grade SaaS platform that combines **live match data**, **specialized AI agents**, and **blockchain payments** to deliver deep football insights.  
It’s built for fans, analysts, and investors who want to go beyond the live‑score.

### The Problem It Solves
Traditional live‑score apps tell you *what* happened.  
WCIA 2.0 tells you **why** – using AI to analyse tactics, momentum, player performance, and tournament scenarios in real time.  
Premium on‑demand reports can be purchased with crypto using Injective’s **x402 payment standard**.

### How Users Interact
- **Browse live & upcoming matches** with real‑time scores, timelines, and stats.
- **Dive into Match Intelligence** – the flagship view with AI tactical analysis, commentary, and danger zones.
- **Chat with an AI Analyst** that streams answers from specialized football agents.
- **Submit predictions** and compare them with AI forecasts.
- **Purchase premium AI reports** (deep tactical, scouting, predictions) using an **Injective wallet**.
- **Explore teams, players, tournament brackets** with AI‑generated scouting reports.
- **Earn rewards** for correct predictions and engagement.

---

## 🚀 Key Features

| Feature | Description |
|---------|-------------|
| **Live Match Intelligence** | Timeline, possession, xG, momentum, win probability, next‑goal probability. |
| **AI Tactical Analysis** | Formation breakdown, pressing intensity, weaknesses, transition analysis. |
| **AI Match Summaries** | Auto‑generated post‑match reports in natural language. |
| **AI Analyst (Chat)** | Streaming chat interface powered by Groq; remembers conversation history. |
| **Predictions Engine** | AI predictions with confidence scores; user can submit their own. |
| **Tournament Intelligence** | Group standings, knockout brackets, qualification scenarios. |
| **Premium Reports** | Purchase deep‑dive reports with **x402** (Injective) – stored forever. |
| **Wallet Connection** | Keplr (primary) and MetaMask supported; wallet address is your identity. |
| **Real‑time Updates** | Scores and stats update via Supabase Realtime. |
| **Responsive Design** | Works on desktop and mobile with a premium, Linear/Vercel‑inspired UI. |

---

## ⛓️ Injective Integration – Four New Technologies

WCIA 2.0 meaningfully integrates **four cutting‑edge Injective technologies**.  
Here’s exactly how each one is used.

### 1. x402 – On‑Chain Premium Payments

**Status:** ✅ Fully functional  
**What it is:** The standard for requesting and verifying payments on Injective.  
**How it’s used:**  
- Users purchase premium AI reports by sending INJ (or USDC) from their wallet.  
- The frontend builds a `MsgSend` transaction, signs it with Keplr/CosmJS, and broadcasts it to Injective.  
- A Supabase Edge Function (`verify-payment`) verifies the on‑chain transaction via the Injective LCD.  
- Once confirmed, the report is unlocked permanently.  
**Key files:**  
- `src/services/payment/x402-service.ts` – builds and sends the payment transaction  
- `supabase/functions/verify-payment/index.ts` – on‑chain verification  

### 2. USDC CCTP – Cross‑Chain USDC Payments

**Status:** 🟡 Partially implemented  
**What it is:** Circle’s Cross‑Chain Transfer Protocol that allows USDC to move natively between blockchains.  
**How it’s used:**  
- The payment infrastructure already supports USDC (the correct IBC denom is configured).  
- Users can pay with USDC that is **already on Injective** (e.g., bridged via CCTP).  
- The premium purchase flow includes a “Pay with USDC (CCTP)” button that uses the same signing client but with the USDC denom.  
- Full cross‑chain burning (MetaMask → Circle bridge → Injective mint) is designed and ready to plug in; a stub service (`cctp-service.ts`) exists for the bridging logic.  
**Key files:**  
- `src/services/payment/cctp-service.ts` – USDC payment logic  
- `src/features/premium-reports/hooks/usePurchaseReport.ts` – branches on payment method  

### 3. MCP Server – Exposing AI Agents to the World

**Status:** 🔮 Planned (architecture ready)  
**What it is:** Model Context Protocol – a standard way for AI tools to discover and call external services.  
**How it’s planned:**  
- All specialized football agents (statistics, tactical, prediction, commentary, fan‑education) are already isolated as pure functions in `supabase/functions/_shared/agents/`.  
- A standalone MCP server (`mcp-server/index.ts`) has been designed that exposes each agent as an MCP tool.  
- External clients (IDE assistants, bots) can call `tools/list` and `tools/call` to get football intelligence directly from WCIA’s AI layer.  
**Key files:**  
- `mcp-server/index.ts` – ready‑to‑run Deno server  
- `supabase/functions/_shared/agents/` – reusable agent definitions  

### 4. Agent Skills – AI That Acts On‑Chain

**Status:** 🔮 Planned (demo‑ready)  
**What it is:** Giving AI agents the ability to perform blockchain transactions based on their analysis.  
**How it’s planned:**  
- The AI Orchestrator (edge function) can already detect user intents.  
- A prototype `/bet` command lets the user say “Bet 1 INJ on Argentina” in the AI chat.  
- The Prediction Agent analyses the match, and a skill builds a `MsgSend` transaction.  
- The transaction is returned to the frontend, where the user signs with Keplr.  
- The wallet layer, transaction signing, and agent outputs are all in place; the full command handling is designed and can be activated with minimal code.  
**Key files:**  
- `supabase/functions/ai-orchestrator/index.ts` – command detection + transaction building  
- `src/features/wallet/services/wallet-service.ts` – transaction signing & broadcasting  

---

## 🛠️ Tech Stack

**Frontend**  
React 19 • Vite • TypeScript • Tailwind CSS v4 • shadcn/ui • Framer Motion • TanStack Query • Zustand • React Router v7 • Recharts • React Markdown • Sonner

**Backend & Database**  
Supabase (PostgreSQL, Auth, Realtime, Storage, Edge Functions)  

**AI**  
Groq API (Llama 3.3 70B) with specialized agents (Statistics, Tactical, Prediction, Commentary, Fan Education) – streaming responses for chat, JSON for reports

**Blockchain**  
Keplr wallet (native Cosmos signing) • CosmJS • Injective SDK (`@injectivelabs/sdk-ts`) for message construction • Injective REST API for broadcasting

---

## 📁 Project Structure (Feature‑First)
src/
├── app/ # Layout, providers, router
├── features/ # Each page is a feature module
│ ├── auth/ # Wallet‑based user provider
│ ├── dashboard/
│ ├── match-intelligence/ # Flagship experience
│ ├── ai-analyst/ # Streaming chat
│ ├── predictions/
│ ├── tactical-center/
│ ├── team-intelligence/
│ ├── player-intelligence/
│ ├── tournament-intelligence/
│ ├── premium-reports/ # x402 payment flow
│ ├── rewards/
│ ├── notifications/
│ └── settings/
├── shared/ # Reusable UI, hooks, utils
├── services/ # AI client, payment services
├── stores/ # Zustand stores (ui, wallet)
└── routes/ # Router + guards
supabase/
├── functions/ # Edge Functions (AI orchestrator, verify‑payment)
│ └── _shared/ # Reused modules (CORS, agents)
└── migrations/ # Database schema
mcp-server/ # Model Context Protocol server


---

## 🔧 Setup & Run Locally

### Prerequisites
- Node.js 18+
- Supabase project (free tier)
- Groq API key (free credits available)

### Clone & Install
```bash
git clone https://github.com/your-username/wcia2.0.git
cd wcia2.0
npm install

VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GROQ_API_KEY=gsk_your-groq-key
VITE_RECIPIENT_ADDRESS=inj1yourwallet...   # where premium payments go
VITE_USDC_DENOM=ibc/2CBC2EA121AE42563B08028466F37B600F2D7D4282342DE938283CC3FB2BC00E   # optional for USDC
