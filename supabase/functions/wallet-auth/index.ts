// supabase/functions/wallet-auth/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Hardcode CORS headers – no shared file needed
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

serve(async (req) => {
  // 1. ALWAYS handle OPTIONS first, no matter what
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,            // 204 No Content is standard for preflight
      headers: corsHeaders,
    });
  }

  try {
    const { walletAddress } = await req.json();

    if (!walletAddress) {
      return new Response(JSON.stringify({ error: "Missing walletAddress" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const email = `wallet-${walletAddress.slice(0, 10)}@wcia.internal`;
    const password = `wcia-${walletAddress}`;

    // Try to find existing user
    const { data: existingUser } = await supabaseAdmin.auth.admin.getUserByEmail(email);
    let userId: string;

    if (existingUser?.user) {
      userId = existingUser.user.id;
    } else {
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      if (createError) throw createError;
      userId = newUser.user.id;
    }

    // Link wallet to profile
    await supabaseAdmin.from("profiles").upsert({
      id: userId,
      wallet_address: walletAddress,
      is_guest: false,
    });

    // Sign in and return session
    const { data: signInData, error: signInError } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });
    if (signInError) throw signInError;

    return new Response(
      JSON.stringify({
        access_token: signInData.session.access_token,
        refresh_token: signInData.session.refresh_token,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    // Always return CORS headers, even on errors
    return new Response(
      JSON.stringify({ error: error.message || "Internal Server Error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});