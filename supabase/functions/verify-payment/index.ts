import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const INJECTIVE_LCD = "https://lcd.injective.network";
const RECIPIENT = Deno.env.get("RECIPIENT_ADDRESS"); // your project's wallet

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { txHash, reportId, userId } = await req.json();
    if (!txHash || !reportId || !userId) {
      throw new Error("Missing parameters");
    }

    // 1. Fetch transaction from Injective LCD
    const txRes = await fetch(`${INJECTIVE_LCD}/cosmos/tx/v1beta1/txs/${txHash}`);
    if (!txRes.ok) throw new Error("Transaction not found on chain");
    const txData = await txRes.json();

    // 2. Validate the transaction (simplified)
    const msgs = txData.tx.body.messages;
    const sendMsg = msgs.find((m: any) => m["@type"] === "/cosmos.bank.v1beta1.MsgSend");
    if (!sendMsg) throw new Error("Not a bank send transaction");
    if (sendMsg.to_address !== RECIPIENT) throw new Error("Invalid recipient");
    const amount = sendMsg.amount[0].amount;

    // 3. Record transaction in DB
    const { error: txError } = await supabaseAdmin.from("transactions").insert({
      user_id: userId,
      type: "x402",
      tx_hash: txHash,
      amount: Number(amount) / 1e18, // assuming INJ with 18 decimals
      currency: "INJ",
      status: "confirmed",
    });
    if (txError) throw txError;

    // 4. Create premium purchase record
    const { error: purchaseError } = await supabaseAdmin
      .from("premium_purchases")
      .insert({
        user_id: userId,
        report_id: reportId,
        amount: Number(amount) / 1e18,
        currency: "INJ",
      });
    if (purchaseError) throw purchaseError;

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});