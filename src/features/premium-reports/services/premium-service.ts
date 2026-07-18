// src/features/premium-reports/services/premium-service.ts
import { supabase } from '@/shared/lib/supabase';
import { makeX402Payment } from '@/services/payment/x402-service';
import { fetchReport } from '@/services/ai/ai-client';

/**
 * Check if a user (by wallet) has already purchased a report for a match + type.
 */
export async function hasPurchased(walletAddress: string, matchId: string, reportType: string): Promise<boolean> {
  const { data } = await supabase
    .from('premium_purchases')
    .select('id')
    .eq('wallet_address', walletAddress)
    .eq('match_id', matchId)
    .eq('report_type', reportType)
    .maybeSingle();
  return !!data;
}

/**
 * After payment, record the purchase and generate the report.
 */
export async function purchaseAndGenerateReport(
  walletAddress: string,
  matchId: string,
  reportType: string,
  txHash: string
) {
  // 1. Record the purchase
  const { error: purchaseError } = await supabase.from('premium_purchases').insert({
    wallet_address: walletAddress,
    match_id: matchId,
    report_type: reportType,
    transaction_hash: txHash,
    amount: 5, // example fixed amount
    currency: 'INJ',
  });
  if (purchaseError) throw purchaseError;

  // 2. Generate the report via AI (frontend direct call, or proxy)
  const reportContent = await fetchReport(matchId, reportType);

  // 3. Save the report in ai_reports
  const { data: report, error: reportError } = await supabase
    .from('ai_reports')
    .insert({
      match_id: matchId,
      type: reportType,
      content: reportContent,
      premium: true,
      agent_id: 'premium',
    })
    .select('*')
    .single();
  if (reportError) throw reportError;

  return report;
}